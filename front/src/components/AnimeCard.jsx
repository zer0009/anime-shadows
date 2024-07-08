import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import './AnimeCard.css';

function AnimeCard({ anime, onClick }) {
  // Add a cache-busting query parameter to the image URL
  const imageUrl = `http://localhost:5000${anime.pictureUrl}?t=${new Date().getTime()}`;

  return (
    <div className="anime-card" onClick={onClick}>
      <CardMedia
        component="div"
        className="card-cover"
        image={imageUrl}
        title={anime.title}
      >
        <Box className={`status-badge ${anime.status === 'completed' ? 'completed' : 'ongoing'}`}>
          {anime.status === 'completed' ? 'مكتمل' : 'يعرض الآن'}
        </Box>
        <IconButton className="favorite-icon" style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <StarIcon />
        </IconButton>
      </CardMedia>
      <CardContent className="card-content">
        <Typography variant="body2" className="title">
          {anime.title}
        </Typography>
      </CardContent>
    </div>
  );
}

export default AnimeCard;

