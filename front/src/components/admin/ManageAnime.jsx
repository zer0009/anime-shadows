import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import { deleteAnime } from '../../api/modules/admin';
import { fetchAnime } from '../../api/modules/anime';
import { useNavigate } from 'react-router-dom';
import styles from './ManageAnime.module.css';

const ManageAnime = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnimes = async () => {
      const data = await fetchAnime();
      setAnimes(data);
    };
    loadAnimes();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

  const filteredAnimes = animes.filter(anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageAnime;