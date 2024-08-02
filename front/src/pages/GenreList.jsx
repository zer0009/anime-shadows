import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchAnimesByGenre, fetchGenreDetails } from '../api/modules/anime';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const GenreList = () => {
  const { t } = useTranslation();
  const { genreId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [genreDetails, setGenreDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [animeResponse, genreResponse] = await Promise.all([
          fetchAnimesByGenre(genreId, currentPage),
          fetchGenreDetails(genreId)
        ]);
        setAnimeList(animeResponse.animes);
        setTotalPages(animeResponse.totalPages);
        setGenreDetails(genreResponse);
      } catch (error) {
        setError(t('genreList.errorFetching', 'Error fetching anime by genre'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId, currentPage, t]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageTitle = genreDetails 
    ? t('genreList.titleWithGenre', '{{genre}} Anime List', { genre: genreDetails.name })
    : t('genreList.title', 'Anime by Genre');

  const pageDescription = genreDetails
    ? t('genreList.descriptionWithGenre', 'Explore the best {{genre}} anime. Find top-rated shows and discover new favorites in the {{genre}} genre.', { genre: genreDetails.name })
    : t('genreList.description', 'Discover anime by genre. Browse our collection of shows categorized by different themes and styles.');

  return (
    <Box sx={{ padding: '20px' }}>
      <Helmet>
        <title>{pageTitle} | AnimeShows</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://animeshows.com/genre/${genreId}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://animeshows.com/genre/${genreId}`} />
        {genreDetails && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": pageTitle,
              "description": pageDescription,
              "url": `https://animeshows.com/genre/${genreId}`,
              "genre": genreDetails.name,
              "numberOfItems": animeList.length,
            })}
          </script>
        )}
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link color="inherit" href="/">
          {t('common.home', 'Home')}
        </Link>
        <Link color="inherit" href="/genres">
          {t('common.genres', 'Genres')}
        </Link>
        <Typography color="textPrimary">{genreDetails?.name || t('common.loading', 'Loading...')}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" sx={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        {pageTitle}
      </Typography>

      {genreDetails && (
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          {genreDetails.description}
        </Typography>
      )}

      <ListDisplay
        title={pageTitle}
        list={animeList}
        loading={loading}
        error={error}
        fields={['title', 'genre', 'rating']}
      />

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default GenreList;