import React from 'react';
import { FaTags, FaUndo, FaList, FaCalendarAlt, FaSort, FaStar, FaSyncAlt } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar.jsx';
import TypeSelect from '../TypeSelect/TypeSelectModal.jsx';
import SeasonSelect from '../SeasonSelect/SeasonSelectModal.jsx';
import SortSelect from '../SortSelect/SortSelectModal.jsx';
import PopularSelect from '../PopularSelect/PopularSelectModal.jsx';
import StateSelect from '../StateSelect/StateSelectModal.jsx';
import styles from './Navbar.module.css';

const Navbar = ({ onTagsClick, onTypeChange, onSeasonChange, onSortChange, onPopularChange, onReset, onSearch, onStateChange }) => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.selectContainer}>
                <button className={styles.navButton} onClick={onTagsClick} aria-label="Tags">
                    <FaTags className={styles.icon} />
                    <span className={styles.text}>Tags</span>
                </button>
                <TypeSelect onChange={onTypeChange} />
                <SeasonSelect onChange={onSeasonChange} />
                <SortSelect onChange={onSortChange} />
                <PopularSelect onChange={onPopularChange} />
                <StateSelect onChange={onStateChange} />
                <button className={styles.navButton} onClick={onReset} aria-label="Reset">
                    <FaUndo className={styles.icon} />
                    <span className={styles.text}>Reset</span>
                </button>
            </div>
            <div className={styles.searchBarContainer}>
                <SearchBar onSearch={onSearch} />
            </div>
        </nav>
    );
};

export default Navbar;