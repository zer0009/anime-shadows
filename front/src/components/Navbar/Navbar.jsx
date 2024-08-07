import React from 'react';
import { FaTags, FaUndo } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar.jsx';
import TypeSelect from '../TypeSelect/TypeSelect.jsx';
import SeasonSelect from '../SeasonSelect/SeasonSelect.jsx';
import SortSelect from '../SortSelect/SortSelect.jsx';
import PopularSelect from '../PopularSelect/PopularSelect.jsx';
import styles from './Navbar.module.css';
import StateSelect from '../StateSelect/StateSelect.jsx';

const Navbar = ({ onTagsClick, onTypeChange, onSeasonChange, onSortChange, onPopularChange, onReset, onSearch, onStateChange }) => {
    return (
        <div className={styles.navbar}>
            <button className={styles.navButton} onClick={onTagsClick}>
                <FaTags /> Tags
            </button>
            <div className={styles.selectContainer}>
                <TypeSelect onChange={onTypeChange} />
                <SeasonSelect onChange={onSeasonChange} />
                <SortSelect onChange={onSortChange} />
                <PopularSelect onChange={onPopularChange} />
                <StateSelect onChange={onStateChange} />
            </div>
            <button className={styles.navButton} onClick={onReset}>
                <FaUndo /> Reset All
            </button>
            <div className={styles.searchBarContainer}>
                <SearchBar onSearch={onSearch} />
            </div>
        </div>
    );
};

export default Navbar;