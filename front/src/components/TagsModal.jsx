import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalDialog, ModalClose, Typography, Button, Switch } from '@mui/joy';
import { FormControlLabel } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import './TagsModal.css';

const TagsModal = ({ open, onClose, onApply }) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [broadMatches, setBroadMatches] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                console.log('Fetched tags:', response.data);
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
        <Modal open={open} onClose={onClose}>
            <ModalDialog className="modal-dialog">
                <ModalClose />
                <Typography component="h2" className="modal-title">Tags</Typography>
                <div className="modal-content">
                    <FormControlLabel
                        control={<Switch checked={broadMatches} onChange={() => setBroadMatches(!broadMatches)} />}
                        label="Broad Matches"
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tags.length > 0 ? (
                            tags.map((tag) => {
                                const checked = selectedTags.includes(tag.name);
                                return (
                                    <Chip
                                        key={tag._id} // Ensure each tag has a unique key
                                        variant="plain"
                                        color={checked ? 'primary' : 'neutral'}
                                        startDecorator={
                                            checked && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                                        }
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
                                                        : [...names, tag.name],
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
                    <div className="dialog-actions">
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleApply}>Apply</Button>
                    </div>
                </div>
            </ModalDialog>
        </Modal>
    );
};

export default TagsModal;