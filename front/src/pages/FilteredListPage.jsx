import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import { fetchGenre, fetchTypes, fetchSeasons } from '../api/modules/anime';
import { Box, Typography, Container, Skeleton, Grid, Chip, ThemeProvider, createTheme, CssBaseline, Paper } from '@mui/material';
import { styled } from '@mui/system';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import FilterListIcon from '@mui/icons-material/FilterList';
import { HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
// Create a theme instance using your color palette
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#c34cbb', // --highlight-color
    },
    secondary: {
      main: '#5e4da5', // --accent-color
    },
    background: {
      default: '#110720', // --primary-dark
      paper: '#1e1e2e', // --background-light
    },
    text: {
      primary: '#d6b2ef', // --text-color
      secondary: '#9f94ec', // --subtext-color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    allVariants: {
      color: '#d6b2ef', // --text-color
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e2e', // --background-light
          color: '#d6b2ef', // --text-color
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a0f47', // --secondary-dark
          color: '#d6b2ef', // --text-color
        },
      },
    },
  },
});

// Styled components
const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    color: '#3b1a5a', // --secondary-light
  },
});

const FilteredListPage = () => {
  const { t } = useTranslation();
  const { filterType, filterValue } = useParams();
  const { animeList, loading, error, handleSearch } = useFetchAnimeList();
  const [filteredList, setFilteredList] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = useCallback(async () => {
    let name = filterValue;

    switch (filterType) {
      case 'type':
        const types = await fetchTypes();
        const type = types.find(t => t._id === filterValue);
        name = type ? type.name : filterValue;
        break;
      case 'genre':
        const genres = await fetchGenre();
        const genre = genres.find(g => g._id === filterValue);
        name = genre ? genre.name : filterValue;
        break;
      case 'season':
        const seasons = await fetchSeasons();
        const season = seasons.find(s => s._id === filterValue);
        name = season ? season.name : filterValue;
        break;
      case 'state':
        const states = [
          { _id: 'ongoing', name: t('animeStatus.ongoing', 'Ongoing') },
          { _id: 'completed', name: t('animeStatus.completed', 'Completed') },
          { _id: 'upcoming', name: t('animeStatus.upcoming', 'Upcoming') },
        ];
        const state = states.find(s => s._id === filterValue);
        name = state ? state.name : filterValue;
        break;
      default:
        name = filterValue;
    }

    setFilterName(name);
  }, [filterType, filterValue, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = animeList;

    switch (filterType) {
      case 'type':
        filtered = animeList.filter(anime => anime.type && anime.type._id === filterValue);
        break;
      case 'genre':
        filtered = animeList.filter(anime => anime.genres && anime.genres.some(genre => genre._id === filterValue));
        break;
      case 'season':
        filtered = animeList.filter(anime => anime.season && anime.season._id === filterValue);
        break;
      case 'state':
        filtered = animeList.filter(anime => anime.status && anime.status.toLowerCase() === filterValue.toLowerCase());
        break;
      default:
        filtered = animeList;
    }

    setFilteredList(filtered);
  }, [filterType, filterValue, animeList]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredList.length / itemsPerPage), [filteredList.length, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = `${t(`filterTypes.${filterType}`, filterType)}: ${filterName} | أنمي شادوز`;
  const pageDescription = t('filteredList.description', 'استكشف أنمي {{filterName}} في فئة {{filterType}}. اعثر على أفضل العروض واكتشف مفضلات جديدة.', { filterName, filterType });

  const seoProps = {
    title: pageTitle,
    description: pageDescription,
    keywords: `${filterName}, ${filterType}, أنمي, Anime Shadows`,
    canonicalUrl: `https://animeshadows.xyz/${filterType}/${filterValue}`,
    ogType: "website",
    ogImage: "https://animeshadows.xyz/default-og-image.jpg", // Add a default OG image
    twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg", // Add a default Twitter image
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageTitle,
      "description": pageDescription,
      "url": `https://animeshadows.xyz/${filterType}/${filterValue}`,
      "numberOfItems": filteredList.length,
    }
  };

  useSEO(seoProps);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ padding: '20px 0' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              marginBottom: '20px',
              borderBottom: '2px solid #3e3e5e',
              paddingBottom: '20px'
            }}>
              <BreadcrumbsComponent
                links={[
                  { to: `/${filterType}s`, label: t(`filterTypes.${filterType}Plural`, `${filterType}s`) }
                ]}
                current={filterName}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    marginRight: '20px'
                  }}
                >
                  {t('filteredList.title', '{{filterType}}: {{filterName}}', { filterType: t(`filterTypes.${filterType}`, filterType), filterName })}
                </Typography>

                <Chip
                  icon={<FilterListIcon />}
                  label={`${filteredList.length} ${t('filteredList.results', 'نتيجة')}`}
                  color="secondary"
                  sx={{ 
                    fontWeight: 'bold',
                    padding: '10px',
                    '& .MuiChip-icon': {
                      color: 'inherit'
                    }
                  }}
                />
              </Box>
            </Box>

            {loading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <Paper elevation={3} sx={{ padding: '20px', backgroundColor: 'error.main', color: 'error.contrastText' }}>
                <Typography>{error}</Typography>
              </Paper>
            ) : (
              <>
                <ListDisplay
                  list={paginatedList}
                  loading={loading}
                  error={error}
                  fields={['title', 'genre', 'rating']}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default FilteredListPage;