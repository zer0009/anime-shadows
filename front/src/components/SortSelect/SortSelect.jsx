import React from 'react';
import styles from './SortSelect.module.css';

const SortSelect = ({ onChange }) => {
    return (
        <select className={styles.select} onChange={(e) => onChange(e.target.value)}>
            <option value="">Sort</option>
            <option value="title">Title</option>
            <option value="rating">Rating</option>
            <option value="releaseDate">Release Date</option>
        </select>
    );
};

export default SortSelect;