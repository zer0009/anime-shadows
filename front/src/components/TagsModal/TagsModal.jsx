import React, { useEffect, useState } from 'react';
import { Modal, ModalDialog, ModalClose, Typography, Button, CircularProgress } from '@mui/joy';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/joy/Box';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { fetchGenre } from '../../api/modules/anime';
import styles from './TagsModal.module.css';

const TagsModal = ({ open, onClose, onApply }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [broadMatches, setBroadMatches] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetchGenre();
        setTags(response);
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
      <ModalDialog dir={isRTL ? 'ltr' : 'rtl'} sx={{
        background: 'var(--secondary-dark)',
        color: 'var(--text-color)',
        borderRadius: '10px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}>
        <ModalClose className={styles.modalClose} />
        <Typography component="h2" className={styles.modalTitle}>{t('tags')}</Typography>
        <div className={styles.modalContent}>
          <Box className={styles.tagsContainer}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : tags.length > 0 ? (
              tags.map((tag) => {
                const checked = selectedTags.includes(tag.name);
                return (
                  <Chip
                    key={tag._id}
                    className={styles.tagChip}
                    icon={checked ? <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} /> : null}
                    onClick={() => handleTagClick(tag)}
                    sx={{
                      cursor: 'pointer',
                      background: checked ? 'var(--primary-color)' : 'var(--primary-light)',
                      color: 'var(--text-color) !important',
                      '&:hover': {
                        background: checked ? 'var(--highlight-color)' : 'var(--primary-dark)',
                      },
                      '& .MuiChip-icon': {
                        color: 'var(--text-color) !important',
                      },
                    }}
                    label={tag.name}
                  />
                );
              })
            ) : (
              <Typography>{t('no_tags_available')}</Typography>
            )}
          </Box>
          <div className={styles.dialogActions}>
            <Button onClick={onClose} variant="outlined" color="neutral" sx={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}>
              {t('cancel')}
            </Button>
            <Button onClick={handleApply} variant="outlined" color="neutral" sx={{ borderColor: 'var(--text-color)', color: 'var(--text-color)' }}>
              {t('apply')}
            </Button>
          </div>
        </div>
      </ModalDialog>
    </Modal>
  );
};

export default TagsModal;