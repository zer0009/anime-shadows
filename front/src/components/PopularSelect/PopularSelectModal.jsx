import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './PopularSelectModal.module.css';

const PopularSelectModal = ({ onChange }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelect = (value) => {
        onChange(value);
        handleClose();
    };

    return (
        <div>
            <Button onClick={handleOpen} className={styles.button}>
                <FaStar className={styles.icon} />
                <span className={styles.text}>Popular</span>
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box className={styles.modal}>
                    <Typography variant="h6" className={styles.modalTitle}>Select Popular Time Frame</Typography>
                    <ul className={styles.list}>
                        <li onClick={() => handleSelect('today')} className={styles.listItem}>Today</li>
                        <li onClick={() => handleSelect('week')} className={styles.listItem}>This Week</li>
                        <li onClick={() => handleSelect('month')} className={styles.listItem}>This Month</li>
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default PopularSelectModal;