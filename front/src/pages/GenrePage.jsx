import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchGenre } from '../api/modules/anime';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import { Box, Typography, Container, Grid, Chip, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import { HelmetProvider } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import SearchIcon from '@mui/icons-material/Search';
import AnimeCard from '../components/AnimeCard/AnimeCard';

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

const GenreChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const GenrePage = () => {
  const { t } = useTranslation();
  const [genres, setGenres] = useState([]);
  const [genreLoading, setGenreLoading] = useState(true);
  const [genreError, setGenreError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { animeList, loading: animeLoading, error: animeError, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setGenreLoading(true);
        const fetchedGenres = await fetchGenre();
        setGenres(fetchedGenres);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setGenreError(t('genrePage.fetchError', 'Error fetching genres'));
      } finally {
        setGenreLoading(false);
      }
    };

    loadGenres();
  }, [t]);

  useEffect(() => {
    handleSearch('', 12); // Fetch initial 12 anime
  }, [handleSearch]);

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seoProps = {
    title: t('genrePage.title', 'Anime Genres | Anime Shadows'),
    description: t('genrePage.description', 'Explore anime by genre on Anime Shadows. Find your favorite genres and discover new anime series.'),
    keywords: t('genrePage.keywords', 'anime genres, anime categories, anime types, Anime Shadows'),
    canonicalUrl: 'https://animeshadows.xyz/genres',
    ogType: 'website',
    ogImage: 'https://animeshadows.xyz/genre-og-image.jpg',
    twitterImage: 'https://animeshadows.xyz/genre-twitter-image.jpg',
  };

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #110720 0%, #2a0f47 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ padding: '40px 0' }}>
            <BreadcrumbsComponent
              links={[]}
              current={t('genrePage.breadcrumb', 'Genres')}
            />

            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
                fontWeight: 'bold',
                color: 'primary.main',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {t('genrePage.heading', 'Anime Genres')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <TextField
                variant="outlined"
                placeholder={t('genrePage.searchPlaceholder', 'Search genres...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '100%', maxWidth: '500px' }}
              />
            </Box>

            {genreLoading ? (
              <Typography>Loading genres...</Typography>
            ) : genreError ? (
              <Typography color="error">{genreError}</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
                {filteredGenres.map((genre) => (
                  <StyledLink to={`/filter/genre/${genre._id}`} key={genre._id}>
                    <GenreChip
                      label={`${genre.name} (${genre.animeCount || 0})`}
                      color="primary"
                      clickable
                    />
                  </StyledLink>
                ))}
              </Box>
            )}

            <Typography variant="h2" sx={{ fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
              {t('genrePage.featuredAnime', 'Featured Anime')}
            </Typography>

            {animeLoading ? (
              <Typography>Loading anime...</Typography>
            ) : animeError ? (
              <Typography color="error">{animeError}</Typography>
            ) : (
              <Grid container spacing={2}>
                {animeList.map((anime) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={anime._id}>
                    <AnimeCard anime={anime} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </HelmetProvider>
  );
};

export default GenrePage;
