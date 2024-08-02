import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button, Typography, Rating } from '@mui/material';

const RatingDialog = ({ ratingDialogOpen, setRatingDialogOpen, selectedRating, setSelectedRating, submitRating, removeRating, userRating, t }) => {
  return (
    <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
      <DialogTitle>{t('animeDetails.rateAnime')}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Rating
            name="rating"
            value={selectedRating}
            max={10}
            precision={0.5}
            onChange={(event, newValue) => setSelectedRating(newValue)}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#ff6d75',
              },
              '& .MuiRating-iconHover': {
                color: '#ff3d47',
              },
            }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {selectedRating ? `${t('animeDetails.yourRating')}: ${selectedRating}` : t('animeDetails.selectRating')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setRatingDialogOpen(false)} color="primary">
          {t('animeDetails.cancel')}
        </Button>
        <Button onClick={submitRating} color="primary">
          {t('animeDetails.submit')}
        </Button>
        {userRating !== null && (
          <Button onClick={removeRating} color="secondary">
            {t('animeDetails.removeRating')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;