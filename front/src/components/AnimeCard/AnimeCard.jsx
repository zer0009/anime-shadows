import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardMedia, CardContent, Typography, Box } from '@mui/material';
import styles from './AnimeCard.module.css';

function AnimeCard({ anime, lastViewed, showLastViewed, episodeNumber, onClick }) {
    const [imageError, setImageError] = useState(false);

    if (!anime) {
        return null; // Return null if anime is not defined
    }

    const imageUrl = `${import.meta.env.VITE_API_URL}${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = 'public/assets/images/default-anime-picture.jpg'; // Ensure this path is correct

    const handleError = () => {
        setImageError(true);
    };

    return (
        <div className={styles.animeCard} onClick={onClick}>
            <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
                <CardMedia
                    component="div"
                    className={styles.cardCover}
                    image={imageError ? defaultPictureUrl : imageUrl}
                    title={anime.title}
                    onError={handleError}
                >
                    <Box className={`${styles.statusBadge} ${anime.status === 'completed' ? styles.statusBadgeCompleted : styles.statusBadgeOngoing}`}>
                        {anime.status === 'completed' ? 'مكتمل' : 'يعرض الآن'}
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
                    {anime.type && anime.type.name && (
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
}

export default AnimeCard;
