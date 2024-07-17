import React, { useEffect, useState } from 'react';
import styles from './StateSelect.module.css';

const StateSelect = ({ onChange }) => {
    const [states, setStates] = useState([]);

    useEffect(() => {
        const hardcodedStates = [
            { _id: '1', name: 'Ongoing' },
            { _id: '2', name: 'Completed' },
            { _id: '3', name: 'Upcoming' },
        ];
        setStates(hardcodedStates);
    }, []);

    return (
        <select className={styles.select} onChange={(e) => onChange(e.target.value)}>
            <option value="">State</option>
            {states.map(state => (
                <option key={state._id} value={state.name}>{state.name}</option>
            ))}
        </select>
    );
};

export default StateSelect;