import React from 'react';
import { FaTags, FaUndo, FaList, FaCalendarAlt, FaSort, FaStar, FaSyncAlt } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar.jsx';
import TypeSelect from '../TypeSelect/TypeSelectModal.jsx';
import SeasonSelect from '../SeasonSelect/SeasonSelectModal.jsx';
import SortSelect from '../SortSelect/SortSelectModal.jsx';
import PopularSelect from '../PopularSelect/PopularSelectModal.jsx';
import styles from './Navbar.module.css';
import StateSelect from '../StateSelect/StateSelectModal.jsx';

const Navbar = ({ onTagsClick, onTypeChange, onSeasonChange, onSortChange, onPopularChange, onReset, onSearch, onStateChange }) => {
    return (
        <div className={styles.navbar}>
            <button className={styles.navButton} onClick={onTagsClick}>
                <FaTags className={styles.icon} />
                <span className={styles.text}>Tags</span>
            </button>
            <div className={styles.selectContainer}>
                <TypeSelect onChange={onTypeChange} />
                <SeasonSelect onChange={onSeasonChange} />
                <SortSelect onChange={onSortChange} />
                <PopularSelect onChange={onPopularChange} />
                <StateSelect onChange={onStateChange} />
            </div>
            <button className={styles.navButton} onClick={onReset}>
                <FaUndo className={styles.icon} />
                <span className={styles.text}>Reset All</span>
            </button>
            <div className={styles.searchBarContainer}>
                <SearchBar onSearch={onSearch} />
            </div>
        </div>
    );
};

export default Navbar;