import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Search, Edit, Delete, Add } from '@mui/icons-material';
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
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnimes = async () => {
      const { animes, totalPages } = await fetchAnime(currentPage);
      setAnimes(animes);
      setTotalPages(totalPages);
    };
    loadAnimes();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (animeId) => {
    try {
      await deleteAnime(animeId);
      setAnimes(animes.filter(anime => anime._id !== animeId));
      alert('Anime deleted successfully');
    } catch (error) {
      console.error('Error deleting anime:', error);
    }
  };

  const handleEdit = (animeId) => {
    navigate(`/admin/edit-anime/${animeId}`);
  };

  const handleAddEpisode = (animeId) => {
    navigate(`/admin/add-episode/${animeId}`);
  };

  const filteredAnimes = Array.isArray(animes) ? animes.filter(anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div>
      <Typography variant="h6">Manage Anime</Typography>
      <TextField
        label="Search Anime"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <IconButton>
              <Search />
            </IconButton>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnimes.map((anime) => (
              <TableRow key={anime._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img src={`${import.meta.env.VITE_API_URL}${anime.pictureUrl}`} alt={anime.title} className={styles.coverImage} />
                    <Typography variant="body1" className={styles.titleText}>{anime.title}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(anime._id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(anime._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleAddEpisode(anime._id)}>
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> 
      </Box>
    </div>
  );
};

export default ManageAnime;