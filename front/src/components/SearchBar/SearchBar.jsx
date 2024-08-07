import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Box, InputBase, IconButton, Paper } from '@mui/material';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSearch}
            className={styles.searchBar}
            elevation={3}
            sx={{ backgroundColor: 'var(--primary-dark)', color: 'var(--text-color)' }}
        >
            <InputBase
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className={styles.searchInput}
                inputProps={{ 'aria-label': 'search anime' }}
                sx={{ color: 'var(--text-color)' }}
            />
            <IconButton 
                type="submit" 
                className={styles.searchButton} 
                aria-label="search"
                sx={{ color: 'var(--text-color)' }}
            >
                <FaSearch />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;