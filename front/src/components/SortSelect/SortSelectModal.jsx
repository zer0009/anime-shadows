import React, { useState } from 'react';
import { FaSort } from 'react-icons/fa';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './SortSelectModal.module.css';

const SortSelectModal = ({ onChange }) => {
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
                <FaSort className={styles.icon} />
                <span className={styles.text}>Sort</span>
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box className={styles.modal}>
                    <Typography variant="h6" className={styles.modalTitle}>Select Sort Option</Typography>
                    <ul className={styles.list}>
                        <li onClick={() => handleSelect('title')} className={styles.listItem}>Title</li>
                        <li onClick={() => handleSelect('rating')} className={styles.listItem}>Rating</li>
                        <li onClick={() => handleSelect('releaseDate')} className={styles.listItem}>Release Date</li>
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default SortSelectModal;