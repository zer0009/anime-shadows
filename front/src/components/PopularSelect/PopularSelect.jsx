import React from 'react';
import styles from './PopularSelect.module.css';

const PopularSelect = ({ onChange }) => {
    return (
        <select className={styles.select} onChange={(e) => onChange(e.target.value)}>
            <option value="">Popular</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
        </select>
    );
};

export default PopularSelect;