import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './AnimeCard.module.css';

const AnimeCard = React.memo(({ anime, lastViewed, showLastViewed, episodeTitle, onClick }) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);

    if (!anime) {
        return null;
    }

    const imageUrl = `${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = '/assets/images/default-anime-picture.jpg';

    const handleError = useCallback(() => {
        setImageError(true);
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return styles.statusBadgeCompleted;
            case 'ongoing':
                return styles.statusBadgeOngoing;
            case 'upcoming':
                return styles.statusBadgeUpcoming;
            default:
                return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return t('animeCard.statusCompleted', 'مكتمل');
            case 'ongoing':
                return t('animeCard.statusOngoing', 'يعرض الآن');
            case 'upcoming':
                return t('animeCard.statusUpcoming', 'قادم قريبا');
            default:
                return '';
        }
    };

    return (
        <Card className={styles.animeCard} onClick={onClick}>
            <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
                <Card.Img
                    variant="top"
                    src={imageError ? defaultPictureUrl : imageUrl}
                    onError={handleError}
                    className={styles.cardCover}
                    alt={t('animeCard.coverAlt', 'غلاف {{title}}', { title: anime.title })}
                    loading="lazy"
                />
                <Card.ImgOverlay>
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
                            <Badge pill bg="info" className={styles.typeBadge}>
                                {anime.type.name}
                            </Badge>
                        )}
                        {episodeTitle && (
                            <Badge pill bg="primary" className={styles.episodeBadge}>
                                {episodeTitle}
                            </Badge>
                        )}
                    </div>
                </Card.Body>
            </Link>
        </Card>
    );
});

export default AnimeCard;