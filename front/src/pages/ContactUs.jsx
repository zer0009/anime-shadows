import React, { useState } from 'react';
import { 
  Box, Button, Container, TextField, Typography, Paper, 
  Select, MenuItem, FormControl, InputLabel, Grid, Snackbar,
  Alert, IconButton, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c34cbb',
    },
    secondary: {
      main: '#5e4da5',
    },
    background: {
      default: '#110720',
      paper: '#1e1e2e',
    },
    text: {
      primary: '#d6b2ef',
      secondary: '#9f94ec',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5e4da5',
            },
            '&:hover fieldset': {
              borderColor: '#c34cbb',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #c34cbb 30%, #5e4da5 90%)',
          border: 0,
          color: 'white',
          height: 48,
          padding: '0 30px',
          boxShadow: '0 3px 5px 2px rgba(195, 76, 187, .3)',
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const ContactOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.secondary.main,
    transform: 'translateY(-3px)',
    transition: 'all 0.3s ease-in-out',
  },
}));

const ContactUs = () => {
  const { t } = useTranslation();
  const [contactReason, setContactReason] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactReason, name, email, message }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('contactUs.success'), severity: 'success' });
        setContactReason('');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      setSnackbar({ open: true, message: t('contactUs.error'), severity: 'error' });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <StyledPaper elevation={3}>
          <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            {t('contactUs.title', 'Contact Us')}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                  {t('contactUs.getInTouch', 'Get in Touch')}
                </Typography>
                <ContactOption>
                  <EmailIcon />
                  <Typography>support@animeshadows.com</Typography>
                </ContactOption>
                <ContactOption>
                  <PhoneIcon />
                  <Typography>+1 (123) 456-7890</Typography>
                </ContactOption>
                <ContactOption>
                  <LocationOnIcon />
                  <Typography>123 Anime Street, Tokyo, Japan</Typography>
                </ContactOption>
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                  {t('contactUs.followUs', 'Follow Us')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <SocialIcon aria-label="Facebook" href="https://facebook.com" target="_blank">
                    <FacebookIcon />
                  </SocialIcon>
                  <SocialIcon aria-label="Twitter" href="https://twitter.com" target="_blank">
                    <TwitterIcon />
                  </SocialIcon>
                  <SocialIcon aria-label="Instagram" href="https://instagram.com" target="_blank">
                    <InstagramIcon />
                  </SocialIcon>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('contactUs.reasonForContact', 'Reason for Contact')}</InputLabel>
                  <Select
                    value={contactReason}
                    onChange={(e) => setContactReason(e.target.value)}
                    required
                  >
                    <MenuItem value="general">{t('contactUs.general', 'General Inquiry')}</MenuItem>
                    <MenuItem value="support">{t('contactUs.support', 'Technical Support')}</MenuItem>
                    <MenuItem value="feedback">{t('contactUs.feedback', 'Feedback')}</MenuItem>
                    <MenuItem value="business">{t('contactUs.business', 'Business Proposal')}</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label={t('contactUs.name', 'Name')}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label={t('contactUs.email', 'Email')}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label={t('contactUs.message', 'Message')}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Box mt={3}>
                  <Button type="submit" variant="contained" fullWidth size="large">
                    {t('contactUs.submit', 'Submit')}
                  </Button>
                </Box>
              </form>
            </Grid>
          </Grid>
        </StyledPaper>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ContactUs;