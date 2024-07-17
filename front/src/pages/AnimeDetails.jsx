import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimeById } from '../api/modules/anime';
import { saveAnimeToHistory, addFavorite, removeFavorite } from '../api/modules/user';
import { IconButton, Typography, Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Favorite, FavoriteBorder, Star, List } from '@mui/icons-material';
import { addEpisode } from '../api/modules/admin';
import styles from './AnimeDetails.module.css';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const AnimeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
    const [episodeTitle, setEpisodeTitle] = useState('');
    const [episodeNumber, setEpisodeNumber] = useState('');

    useEffect(() => {
        const getAnimeDetails = async () => {
            try {
                const response = await fetchAnimeById(id);
                setAnime(response);
                const favoriteStatus = localStorage.getItem(`favorite-${id}`);
                setIsFavorite(favoriteStatus === 'true' || response.isFavorite || false);
                // Check if the user is an admin
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.role === 'admin') {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('Error fetching anime details or saving to history:', error);
                setError('Error fetching anime details');
            } finally {
                setLoading(false);
            }
        };

        getAnimeDetails();
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`favorite-${id}`, isFavorite);
    }, [isFavorite, id]);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                const x = await removeFavorite(anime._id);
                console.log(x);
            } else {
                const x = await addFavorite(anime._id);
                console.log(x);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const handleAddEpisode = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await addEpisode({ animeId: anime._id, title: episodeTitle, number: episodeNumber });
        }
        setOpen(false);
    };

    const openModal = (episode) => {
        navigate(`/episode/${episode._id}`);
    };

    const handleGenreClick = (genreId) => {
        navigate(`/filter/genre/${genreId}`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!anime) {
        return <div>No anime details found.</div>;
    }

    return (
        <div className={styles.animeDetailsContainer}>
            <div className={styles.leftSection}>
                <h1 className={styles.animeTitle}>{anime.title}</h1>
                <div className={styles.animeRating}>
                    <div className={styles.ratingStars}>
                        {/* Render stars based on rating */}
                        {[...Array(5)].map((star, index) => (
                            <i key={index} className={`fas fa-star ${index < anime.rating ? 'filled' : ''}`}></i>
                        ))}
                    </div>
                    <div className={styles.ratingScore}>{anime.rating}</div>
                    <div className={styles.ratingUsers}>{anime.ratingUsers} مستخدم</div>
                </div>
                <div className={styles.animeDetailsPage}>
                    <p className={styles.animeSubtitle}>{anime.description}</p>
                    <div className={styles.animeTags}>
                        {anime.genres.map(genre => (
                            <span
                                key={genre._id}
                                className={styles.animeTag}
                                onClick={() => handleGenreClick(genre._id)}
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.animeEpisodes}>
                    <h2>قائمة الحلقات</h2>
                    <ul>
                        {anime.episodes && anime.episodes.length > 0 ? (
                            anime.episodes.map(episode => (
                                <li key={episode._id} className={styles.episodeItem} onClick={() => openModal(episode)}>
                                    <div className={styles.episodePlayIcon}>▶</div>
                                    <div className={styles.episodeInfo}>
                                        <h3>{episode.title}</h3>
                                        <p>{anime.title}</p>
                                    </div>
                                    <img src={`${import.meta.env.VITE_API_URL}${anime.pictureUrl}`} alt={episode.title} className={styles.episodeThumbnail} />
                                </li>
                            ))
                        ) : (
                            <li>No episodes available</li>
                        )}
                    </ul>
                    {isAdmin && (
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                            Add Episode
                        </Button>
                    )}
                </div>
            </div>
            <div className={styles.animeSidebar}>
                <img src={`${import.meta.env.VITE_API_URL}${anime.pictureUrl}`} alt={anime.title} className={styles.animeImage} />
                <div className={styles.sidebarActions}>
                    <button className={styles.sidebarButton} onClick={() => alert('Rate functionality not implemented yet')}>
                        <Star className="icon" /> Rate
                    </button>
                    <button className={styles.sidebarButton} onClick={handleFavoriteClick}>
                        {isFavorite ? <Favorite className="icon" /> : <FavoriteBorder className="icon" />} Favorite
                    </button>
                </div>
                <div className={styles.animeMeta}>
                    <button className={styles.watchNowButton}>{anime.status ? anime.status : 'N/A'}</button>
                    <button className={styles.trailerButton}>{anime.type ? anime.type.name : 'N/A'}</button>
                    <p><strong>النوع:</strong> {anime.type ? anime.type.name : 'N/A'}</p>
                    <p><strong>سنة العرض:</strong> {anime.startDate ? anime.startDate : 'N/A'}</p>
                    <p><strong>الموسم:</strong> {anime.season ? anime.season.name : 'N/A'}</p>
                    <p><strong>المصدر:</strong> {anime.source ? anime.source : 'N/A'}</p>
                    <p><strong>الأستوديو:</strong> {anime.studio ? anime.studio : 'N/A'}</p>
                    <p><strong>مدة الحلقة:</strong> {anime.episodeDuration ? `${anime.episodeDuration} دقيقة` : 'N/A'}</p>                </div>
            </div>

            {/* Modal for adding episode */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Episode</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Episode Title"
                        value={episodeTitle}
                        onChange={(e) => setEpisodeTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Episode Number"
                        value={episodeNumber}
                        onChange={(e) => setEpisodeNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddEpisode} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AnimeDetails;
