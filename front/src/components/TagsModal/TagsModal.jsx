import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalDialog, ModalClose, Typography, Button, Switch, Checkbox } from '@mui/joy';
import { FormControlLabel } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import styles from './TagsModal.module.css';

const TagsModal = ({ open, onClose, onApply }) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [broadMatches, setBroadMatches] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleTagClick = (tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag.name)
                ? prevSelectedTags.filter((t) => t !== tag.name)
                : [...prevSelectedTags, tag.name]
        );
    };

    const handleApply = () => {
        onApply(selectedTags, broadMatches);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} className={styles.modal}>
            <ModalDialog className={styles.modalDialog}>
                <ModalClose className={styles.modalClose} />
                <Typography component="h2" className={styles.modalTitle}>Tags</Typography>
                <div className={styles.modalContent}>
                    <FormControlLabel
                        control={<Switch checked={broadMatches} onChange={() => setBroadMatches(!broadMatches)} />}
                        label="Broad Matches"
                        className={styles.switchLabel}
                    />
                    <Box className={styles.tagsContainer}>
                        {tags.length > 0 ? (
                            tags.map((tag) => {
                                const checked = selectedTags.includes(tag.name);
                                return (
                                    <Chip
                                        key={tag._id}
                                        variant="plain"
                                        color={checked ? 'primary' : 'neutral'}
                                        className={styles.tagChip}
                                        startDecorator={checked && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />}
                                    >
                                        <Checkbox
                                            variant="outlined"
                                            color={checked ? 'primary' : 'neutral'}
                                            disableIcon
                                            overlay
                                            label={tag.name}
                                            checked={checked}
                                            onChange={(event) => {
                                                setSelectedTags((names) =>
                                                    !event.target.checked
                                                        ? names.filter((n) => n !== tag.name)
                                                        : [...names, tag.name]
                                                );
                                            }}
                                        />
                                    </Chip>
                                );
                            })
                        ) : (
                            <Typography>No tags available</Typography>
                        )}
                    </Box>
                    <div className={styles.dialogActions}>
                        <Button onClick={onClose} variant="outlined">Cancel</Button>
                        <Button onClick={handleApply} variant="contained">Apply</Button>
                    </div>
                </div>
            </ModalDialog>
        </Modal>
    );
};

export default TagsModal;