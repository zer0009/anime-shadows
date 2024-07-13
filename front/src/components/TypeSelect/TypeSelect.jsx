import React, { useEffect, useState } from 'react';
import { fetchTypes } from '../../api/modules/anime';
import styles from './TypeSelect.module.css';

const TypeSelect = ({ onChange }) => {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchTypes();
            setTypes(response.data);
        };
        fetchData();
    }, []);

    return (
        <select className={styles.select} onChange={(e) => onChange(e.target.value)}>
            <option value="">Type</option>
            {types.map(type => (
                <option key={type._id} value={type.name}>{type.name}</option>
            ))}
        </select>
    );
};

export default TypeSelect;