import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button, Typography, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RatingDialog = React.memo(({ ratingDialogOpen, setRatingDialogOpen, selectedRating, setSelectedRating, submitRating, removeRating, userRating }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} fullWidth maxWidth="sm" dir={isRTL ? 'rtl' : 'ltr'}>
      <DialogTitle>{t('animeDetails.rateAnime')}</DialogTitle>
      <DialogContent sx={{ backgroundColor: '#f0f0f0' }}>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('animeDetails.yourRating')}
          </Typography>
          <Rating
            name="rating"
            value={selectedRating}
            max={10}
            precision={0.5}
            onChange={(event, newValue) => setSelectedRating(newValue)}
            size="large"
            sx={{
              direction: 'ltr',
              '& .MuiRating-iconFilled': {
                color: '#ff6d75',
              },
              '& .MuiRating-iconHover': {
                color: '#ff3d47',
              },
              '& .MuiRating-iconEmpty': {
                color: '#ffb3b3',
              },
            }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {selectedRating ? `${t('animeDetails.yourRating')}: ${selectedRating}` : t('animeDetails.selectRating')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <Button onClick={() => setRatingDialogOpen(false)} color="primary" variant="outlined" sx={{ mx: 1 }}>
          {t('animeDetails.cancel')}
        </Button>
        <Button onClick={submitRating} color="primary" variant="contained" sx={{ mx: 1 }}>
          {t('animeDetails.submit')}
        </Button>
        {userRating !== null && (
          <Button onClick={removeRating} color="secondary" variant="contained" sx={{ mx: 1 }}>
            {t('animeDetails.removeRating')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

export default RatingDialog;