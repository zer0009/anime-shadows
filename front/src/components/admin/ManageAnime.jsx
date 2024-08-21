import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { Search, Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { deleteAnime } from '../../api/modules/admin';
import { fetchAnime } from '../../api/modules/anime';
import { useNavigate } from 'react-router-dom';
import styles from './ManageAnime.module.css';
import PaginationComponent from '../Pagination/PaginationComponent';

const ManageAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnimes();
  }, [currentPage]);

  const loadAnimes = async () => {
    try {
      const { animes, totalPages } = await fetchAnime(currentPage);
      setAnimes(animes);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error loading animes:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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

  const filteredAnimes = animes.filter(anime => 
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper className={styles.manageAnime}>
      <Typography variant="h6" className={styles.title}>Manage Anime</Typography>
      <Box className={styles.searchBox}>
        <TextField
          label="Search Anime"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnimes.map((anime) => (
              <TableRow key={anime._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img src={anime.pictureUrl} alt={anime.title} className={styles.coverImage} />
                    <Typography variant="body1" className={styles.titleText}>{anime.title}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Anime">
                    <IconButton onClick={() => handleViewAnime(anime.slug)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Anime">
                    <IconButton onClick={() => handleEdit(anime._id)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Anime">
                    <IconButton onClick={() => handleDeleteClick(anime)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add Episode">
                    <IconButton onClick={() => handleAddEpisode(anime._id)}>
                      <Add />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
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
    </Paper>
  );
};

export default ManageAnime;