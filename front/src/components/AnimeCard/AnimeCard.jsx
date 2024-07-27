import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import styles from './AnimeCard.module.css';

const AnimeCard = React.memo(({ anime, lastViewed, showLastViewed, episodeTitle, onClick }) => {
    const [imageError, setImageError] = useState(false);

    if (!anime) {
        return null; // Return null if anime is not defined
    }

    const imageUrl = `${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = 'public/assets/images/default-anime-picture.jpg'; // Ensure this path is correct

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

    return (
        <Card className={styles.animeCard} onClick={onClick}>
            <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
                <Card.Img
                    variant="top"
                    src={imageError ? defaultPictureUrl : imageUrl}
                    onError={handleError}
                    className={styles.cardCover}
                    alt={anime.title}
                />
                <Card.ImgOverlay>
                    <Badge
                        pill
                        className={`${styles.statusBadge} ${getStatusBadgeClass(anime.status)}`}
                    >
                        {anime.status === 'completed' ? 'مكتمل' : anime.status === 'ongoing' ? 'يعرض الآن' : 'قادم قريبا'}
                    </Badge>
                </Card.ImgOverlay>
                <Card.Body className={styles.cardContent}>
                    <Card.Title className={styles.title}>{anime.title}</Card.Title>
                    {showLastViewed && lastViewed && (
                        <Card.Text className={styles.lastViewed}>
                            Last viewed: {new Date(lastViewed).toLocaleDateString()}
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