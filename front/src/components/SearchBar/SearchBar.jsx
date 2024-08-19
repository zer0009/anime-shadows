import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { InputBase, IconButton, Paper } from '@mui/material';
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
        >
            <InputBase
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime..."
                className={styles.searchInput}
                inputProps={{ 'aria-label': 'search anime' }}
            />
            <IconButton 
                type="submit" 
                className={styles.searchButton} 
                aria-label="search"
            >
                <FaSearch />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;