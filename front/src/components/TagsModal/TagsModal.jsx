import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalDialog, ModalClose, Typography, Button, Switch, CircularProgress } from '@mui/joy';
import { FormControlLabel } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import { styled } from '@mui/system';
import styles from './TagsModal.module.css';

const StyledModalDialog = styled(ModalDialog)({
  background: 'linear-gradient(135deg, var(--secondary-dark) 0%, var(--secondary-light) 100%)',
  color: '#ffffff',
  borderRadius: '10px',
  padding: '2rem',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
});

const StyledChip = styled(Chip)(({ theme, checked }) => ({
  cursor: 'pointer',
  background: checked ? 'var(--accent-light)' : '#2e2e2e',
  color: '#ffffff',
  '&:hover': {
    background: checked ? 'var(--accent-light)' : '#3e3e3e',
  },
  '&.MuiChip-colorPrimary': {
    background: '#6200ea',
    color: '#ffffff',
  },
}));

const TagsModal = ({ open, onClose, onApply }) => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [broadMatches, setBroadMatches] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/genres');
        setTags(response.data);
      } catch (error) {
        setError('Error fetching tags');
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
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
      <StyledModalDialog>
        <ModalClose className={styles.modalClose} />
        <Typography component="h2" className={styles.modalTitle}>Tags</Typography>
        <div className={styles.modalContent}>
          <FormControlLabel
            control={<Switch checked={broadMatches} onChange={() => setBroadMatches(!broadMatches)} />}
            label="Broad Matches"
            className={styles.switchLabel}
          />
          <Box className={styles.tagsContainer}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : tags.length > 0 ? (
              tags.map((tag) => {
                const checked = selectedTags.includes(tag.name);
                return (
                  <StyledChip
                    key={tag._id}
                    variant="plain"
                    color={checked ? 'primary' : 'default'}
                    className={styles.tagChip}
                    startDecorator={checked && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />}
                    onClick={() => handleTagClick(tag)}
                    checked={checked}
                  >
                    {tag.name}
                  </StyledChip>
                );
              })
            ) : (
              <Typography>No tags available</Typography>
            )}
          </Box>
          <div className={styles.dialogActions}>
            <Button onClick={onClose} variant="outlined" color="neutral">Cancel</Button>
            <Button onClick={handleApply} variant="contained" color="primary">Apply</Button>
          </div>
        </div>
      </StyledModalDialog>
    </Modal>
  );
};

export default TagsModal;
