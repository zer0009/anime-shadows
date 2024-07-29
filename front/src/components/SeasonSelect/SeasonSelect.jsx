import React, { useEffect, useState } from 'react';
import { fetchSeasons } from '../../api/modules/anime';
import styles from './SeasonSelect.module.css';

const SeasonSelect = ({ onChange }) => {
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSeasons();
            setSeasons(response);
        };
        fetchData();
    }, []);

    return (
        <select className={styles.select} onChange={(e) => onChange(e.target.value)}>
            <option value="">Season</option>
            {seasons.map(season => (
                <option key={season._id} value={season.name}>{season.name} {season.year}</option>
            ))}
        </select>
    );
};

export default SeasonSelect;