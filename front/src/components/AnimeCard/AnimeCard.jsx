import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CardMedia, CardContent, Typography, Box } from '@mui/material';
import styles from './AnimeCard.module.css';

const AnimeCard = React.memo(({ anime, lastViewed, showLastViewed, episodeNumber, onClick }) => {
    const [imageError, setImageError] = useState(false);

    if (!anime) {
        return null; // Return null if anime is not defined
    }

    const imageUrl = `${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = 'public/assets/images/default-anime-picture.jpg'; // Ensure this path is correct

    const handleError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div className={styles.animeCard} onClick={onClick}>
            <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
                <CardMedia
                    component="div"
                    className={styles.cardCover}
                    image={imageError ? defaultPictureUrl : imageUrl}
                    title={anime.title}
                    onError={handleError}
                    loading="lazy" // Lazy load the image
                >
                    <Box className={`${styles.statusBadge} ${styles[`statusBadge${anime.status.charAt(0).toUpperCase() + anime.status.slice(1)}`]}`}>
                        {anime.status === 'completed' ? 'مكتمل' : anime.status === 'ongoing' ? 'يعرض الآن' : 'قادم قريبا'}
                    </Box>
                </CardMedia>
                <CardContent className={styles.cardContent}>
                    <Typography variant="body2" className={styles.title}>
                        {anime.title}
                    </Typography>
                    {showLastViewed && lastViewed && (
                        <Typography variant="body2" className={styles.lastViewed}>
                            Last viewed: {new Date(lastViewed).toLocaleDateString()}
                        </Typography>
                    )}
                    {anime.type?.name && (
                        <Box className={styles.typeBadge}>
                            {anime.type.name}
                        </Box>
                    )}
                    {episodeNumber && (
                        <Box className={styles.episodeBadge}>
                            {`Episode ${episodeNumber}`}
                        </Box>
                    )}
                </CardContent>
            </Link>
        </div>
    );
});

export default AnimeCard;