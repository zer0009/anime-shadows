import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import styles from './AnimeCard.module.css';

function AnimeCard({ anime, lastViewed, showLastViewed }) {
    const [imageError, setImageError] = useState(false);

    if (!anime) {
        return null; // Return null if anime is not defined
    }

    // Add a cache-busting query parameter to the image URL
    const imageUrl = `http://localhost:5000${anime.pictureUrl}?t=${new Date().getTime()}`;
    const defaultPictureUrl = '../../assets/images/default-anime-picture.jpg'; // Ensure this path is correct

    const handleError = () => {
        setImageError(true);
    };

    return (
        <Link to={`/anime/${anime._id}`} className={styles.animeCardLink}>
            <div className={styles.animeCard}>
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
                    <IconButton className={styles.favoriteIcon}>
                        <StarIcon />
                    </IconButton>
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
                    <Box className={styles.typeBadge}>
                        {anime.type.name}
                    </Box>
                </CardContent>
            </div>
        </Link>
    );
}

export default AnimeCard;
