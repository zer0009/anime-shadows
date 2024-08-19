import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './AnimeCard.module.css';

const AnimeCard = React.memo(({ anime, lastViewed, showLastViewed, episodeNumber, episodeId, onClick }) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    if (!anime) {
        return null;
    }

    const imageUrl = `${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = '/assets/images/default-anime-picture.jpg';

    const handleError = useCallback(() => {
        setImageError(true);
    }, []);

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: styles.statusBadgeCompleted,
            ongoing: styles.statusBadgeOngoing,
            upcoming: styles.statusBadgeUpcoming,
        };
        return statusClasses[status] || '';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            completed: t('animeCard.statusCompleted', 'مكتمل'),
            ongoing: t('animeCard.statusOngoing', 'يعرض الآن'),
            upcoming: t('animeCard.statusUpcoming', 'قادم قريبا'),
        };
        return statusTexts[status] || '';
    };

    const handleEpisodeClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const url = `/episode/${anime.slug}-الحلقة-${episodeNumber}`;
        console.log('Navigating to:', url);
        navigate(url);
    };

    const handleCardClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Card className={styles.animeCard} onClick={handleCardClick}>
            <Link to={`/anime/${anime.slug}`} className={styles.animeCardLink}>
                <LazyLoadImage
                    src={imageError ? defaultPictureUrl : imageUrl}
                    alt={t('animeCard.coverAlt', 'غلاف {{title}}', { title: anime.title })}
                    onError={handleError}
                    effect="blur"
                    threshold={300}
                    className={styles.cardCover}
                    wrapperClassName={styles.imageWrapper}
                />
                <Card.ImgOverlay className={styles.cardOverlay}>
                    <Badge
                        pill
                        className={`${styles.statusBadge} ${getStatusBadgeClass(anime.status)}`}
                    >
                        {getStatusText(anime.status)}
                    </Badge>
                </Card.ImgOverlay>
                <Card.Body className={styles.cardContent}>
                    <Card.Title className={styles.title}>{anime.title}</Card.Title>
                    {showLastViewed && lastViewed && (
                        <Card.Text className={styles.lastViewed}>
                            {t('animeCard.lastViewed', 'آخر مشاهدة: {{date}}', { date: new Date(lastViewed).toLocaleDateString() })}
                        </Card.Text>
                    )}
                    <div className={styles.badgesContainer}>
                        {anime.type?.name && (
                            <Badge pill className={styles.typeBadge}>
                                {anime.type.name}
                            </Badge>
                        )}
                        {episodeNumber && (
                            <Badge pill className={styles.episodeBadge} onClick={handleEpisodeClick}>
                                {t('animeCard.episode', 'الحلقة')} {episodeNumber}
                                <PlayArrowIcon className={styles.playIcon} />
                            </Badge>
                        )}
                    </div>
                </Card.Body>
            </Link>
        </Card>
    );
});

export default AnimeCard;