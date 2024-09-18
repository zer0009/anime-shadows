import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, InputAdornment, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { deleteAnime } from '../../api/modules/admin';
import { fetchAnime } from '../../api/modules/anime';
import { useNavigate } from 'react-router-dom';
import styles from './ManageAnime.module.css';
import PaginationComponent from '../Pagination/PaginationComponent';
import debounce from 'lodash/debounce';

const ManageAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const loadAnimes = useCallback(async (query = searchQuery) => {
    setIsLoading(true);
    try {
      const { animes, totalPages } = await fetchAnime(
        currentPage,
        25,
        query,
        [], // tags (empty array for now)
        typeFilter,
        seasonFilter,
        sortBy,
        false, // popular (false for now)
        '', // state (empty string for now)
        false // broadMatches (false for now)
      );
      setAnimes(animes);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error loading animes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, typeFilter, seasonFilter, sortBy]);

  useEffect(() => {
    loadAnimes();
  }, [loadAnimes, currentPage, typeFilter, seasonFilter, sortBy]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setCurrentPage(1);
      loadAnimes(query);
    }, 300),
    [loadAnimes]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (anime) => {
    setAnimeToDelete(anime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAnime(animeToDelete._id);
      setAnimes(animes.filter(anime => anime._id !== animeToDelete._id));
      setDeleteDialogOpen(false);
      setAnimeToDelete(null);
      // You might want to show a success message here
    } catch (error) {
      console.error('Error deleting anime:', error);
      // You might want to show an error message here
    }
  };

  const handleEdit = (animeId) => {
    navigate(`/admin/edit-anime/${animeId}`);
  };

  const handleAddEpisode = (animeId) => {
    navigate(`/admin/add-episode/${animeId}`);
  };

  const handleViewAnime = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSeasonFilterChange = (event) => {
    setSeasonFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box className={styles.manageAnime}>
      <Typography variant="h5" className={styles.sectionTitle}>Manage Anime</Typography>
      <Box className={styles.searchBox}>
        <TextField
          label="Search Anime"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            label="Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="TV">TV</MenuItem>
            <MenuItem value="Movie">Movie</MenuItem>
            <MenuItem value="OVA">OVA</MenuItem>
            <MenuItem value="Special">Special</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Season</InputLabel>
          <Select
            value={seasonFilter}
            onChange={handleSeasonFilterChange}
            label="Season"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Winter">Winter</MenuItem>
            <MenuItem value="Spring">Spring</MenuItem>
            <MenuItem value="Summer">Summer</MenuItem>
            <MenuItem value="Fall">Fall</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="lastUpdate">Last Update</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer className={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeader}>Title</TableCell>
                <TableCell align="right" className={styles.tableHeader}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animes.map((anime) => (
                <TableRow key={anime._id} className={styles.tableRow}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {anime.pictureUrl && (
                        <img 
                          src={anime.pictureUrl} 
                          alt={anime.title} 
                          className={styles.coverImage} 
                        />
                      )}
                      <Typography variant="body1" className={styles.titleText}>
                        {anime.title || 'Untitled'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Anime">
                      <IconButton 
                        onClick={() => handleViewAnime(anime.slug || anime._id)} 
                        className={styles.actionButton}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Anime">
                      <IconButton 
                        onClick={() => handleEdit(anime._id)} 
                        className={styles.actionButton}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Anime">
                      <IconButton 
                        onClick={() => handleDeleteClick(anime)} 
                        className={styles.actionButton}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Episode">
                      <IconButton 
                        onClick={() => handleAddEpisode(anime._id)} 
                        className={styles.actionButton}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="center" mt={3}>
        <PaginationComponent 
          totalPages={totalPages} 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
        />
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{animeToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAnime;