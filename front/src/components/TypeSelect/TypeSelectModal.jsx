import React, { useEffect, useState } from 'react';
import { fetchTypes } from '../../api/modules/anime';
import { FaListAlt } from 'react-icons/fa';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './TypeSelectModal.module.css';

const TypeSelectModal = ({ onChange }) => {
    const [types, setTypes] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchTypes();
            setTypes(response);
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
                <FaListAlt className={styles.icon} />
                <span className={styles.text}>Type</span>
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box className={styles.modal}>
                    <Typography variant="h6" className={styles.modalTitle}>Select a Type</Typography>
                    <ul className={styles.list}>
                        {types.map(type => (
                            <li key={type._id} onClick={() => handleSelect(type.name)} className={styles.listItem}>
                                {type.name}
                            </li>
                        ))}
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default TypeSelectModal;