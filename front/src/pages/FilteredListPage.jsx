import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import { fetchGenre, fetchTypes, fetchSeasons } from '../api/modules/anime';
import { Box, Typography, Container, Skeleton, Grid, Chip, ThemeProvider, createTheme, CssBaseline, Paper, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortIcon from '@mui/icons-material/Sort';
import { HelmetProvider } from 'react-helmet-async';
import { useSEO } from '../hooks/useSEO';
import BreadcrumbsComponent from '../components/common/BreadcrumbsComponent';
import AnimeCard from '../components/AnimeCard/AnimeCard';

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
  const [sortOption, setSortOption] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [quickFilter, setQuickFilter] = useState('all');
  const itemsPerPage = 24;

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

    // Apply quick filter
    if (quickFilter !== 'all') {
      filtered = filtered.filter(anime => anime.status === quickFilter);
    }

    // Apply sorting
    switch (sortOption) {
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      default:
        break;
    }

    setFilteredList(filtered);
  }, [filterType, filterValue, animeList, quickFilter, sortOption]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredList.length / itemsPerPage), [filteredList.length, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  const handleQuickFilterChange = (event) => {
    setQuickFilter(event.target.value);
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
        <Container maxWidth="xl">
          <Box sx={{ padding: '20px 0' }}>
            <BreadcrumbsComponent
              links={[
                { to: `/${filterType}s`, label: t(`filterTypes.${filterType}Plural`, `${filterType}s`) }
              ]}
              current={filterName}
            />

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              marginBottom: '20px',
              borderBottom: '2px solid #3e3e5e',
              paddingBottom: '20px'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
                    fontWeight: 'bold',
                    color: 'primary.main',
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

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    displayEmpty
                    sx={{ marginRight: '10px', minWidth: '120px' }}
                  >
                    <MenuItem value="default">{t('filteredList.sortDefault', 'Default')}</MenuItem>
                    <MenuItem value="title_asc">{t('filteredList.sortTitleAsc', 'Title (A-Z)')}</MenuItem>
                    <MenuItem value="title_desc">{t('filteredList.sortTitleDesc', 'Title (Z-A)')}</MenuItem>
                    <MenuItem value="rating_desc">{t('filteredList.sortRating', 'Highest Rated')}</MenuItem>
                    <MenuItem value="latest">{t('filteredList.sortLatest', 'Latest')}</MenuItem>
                  </Select>
                  <Select
                    value={quickFilter}
                    onChange={handleQuickFilterChange}
                    displayEmpty
                    sx={{ minWidth: '120px' }}
                  >
                    <MenuItem value="all">{t('filteredList.filterAll', 'All Status')}</MenuItem>
                    <MenuItem value="ongoing">{t('animeStatus.ongoing', 'Ongoing')}</MenuItem>
                    <MenuItem value="completed">{t('animeStatus.completed', 'Completed')}</MenuItem>
                    <MenuItem value="upcoming">{t('animeStatus.upcoming', 'Upcoming')}</MenuItem>
                  </Select>
                </Box>
                <Tooltip title={viewMode === 'grid' ? t('filteredList.switchToList', 'Switch to List View') : t('filteredList.switchToGrid', 'Switch to Grid View')}>
                  <IconButton onClick={toggleViewMode}>
                    {viewMode === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {loading ? (
              <Grid container spacing={3}>
                {[...Array(12)].map((_, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <Paper elevation={3} sx={{ padding: '20px', backgroundColor: 'error.main', color: 'error.contrastText' }}>
                <Typography>{error}</Typography>
              </Paper>
            ) : filteredList.length === 0 ? (
              <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography>{t('filteredList.noResults', 'No results found')}</Typography>
              </Paper>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <Grid container spacing={2}>
                    {paginatedList.map((anime) => (
                      <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={anime._id}>
                        <AnimeCard anime={anime} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Paper elevation={3} sx={{ padding: '20px' }}>
                    {paginatedList.map((anime) => (
                      <Box key={anime._id} sx={{ marginBottom: '20px', borderBottom: '1px solid #3e3e5e', paddingBottom: '20px' }}>
                        <Typography variant="h6">{anime.title}</Typography>
                        <Typography variant="body2">{anime.description}</Typography>
                        <Typography variant="caption">Rating: {anime.rating}</Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
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