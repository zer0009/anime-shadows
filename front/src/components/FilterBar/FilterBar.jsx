import React, { useState } from 'react';
import styles from './FilterBar.module.css';

const FilterBar = ({ onFilterChange }) => {
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ type, genre, timeFrame });
  };

  return (
    <div className={styles.filterBar}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        <option value="movie">Movie</option>
        <option value="series">Series</option>
        <option value="OVA">OVA</option>
        <option value="ONA">ONA</option>
        <option value="special">Special</option>
      </select>
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
        <option value="">All Time</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default FilterBar;