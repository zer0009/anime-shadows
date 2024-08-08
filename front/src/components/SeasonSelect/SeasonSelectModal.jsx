import React, { useEffect, useState } from 'react';
import { fetchSeasons } from '../../api/modules/anime';
import { FaCalendarAlt } from 'react-icons/fa';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './SeasonSelectModal.module.css';

const SeasonSelectModal = ({ onChange }) => {
    const [seasons, setSeasons] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchSeasons();
            setSeasons(response);
        };
        fetchData();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelect = (value) => {
        onChange(value);
        handleClose();
    };

    return (
        <div>
            <Button onClick={handleOpen} className={styles.button}>
                <FaCalendarAlt className={styles.icon} />
                <span className={styles.text}>Select Season</span>
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box className={styles.modal}>
                    <Typography variant="h6">Season</Typography>
                    <ul className={styles.list}>
                        {seasons.map(season => (
                            <li key={season._id} onClick={() => handleSelect(season.name)}>
                                {season.name} {season.year}
                            </li>
                        ))}
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default SeasonSelectModal;