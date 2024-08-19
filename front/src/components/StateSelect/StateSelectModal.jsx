import React, { useEffect, useState } from 'react';
import { FaList } from 'react-icons/fa';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './StateSelectModal.module.css';

const StateSelectModal = ({ onChange }) => {
    const [states, setStates] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hardcodedStates = [
            { _id: '1', name: 'Ongoing' },
            { _id: '2', name: 'Completed' },
            { _id: '3', name: 'Upcoming' },
        ];
        setStates(hardcodedStates);
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
                <FaList className={styles.icon} />
                <span className={styles.text}>State</span>
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box className={styles.modal}>
                    <Typography variant="h6" className={styles.modalTitle}>Select a State</Typography>
                    <ul className={styles.list}>
                        {states.map(state => (
                            <li key={state._id} onClick={() => handleSelect(state.name)} className={styles.listItem}>
                                {state.name}
                            </li>
                        ))}
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default StateSelectModal;