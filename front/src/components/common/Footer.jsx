import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, YouTube } from '@mui/icons-material';
import { Box, Container, Typography, IconButton, Grid } from '@mui/material';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg" className={styles.container}>
        <Grid container spacing={2} className={styles.footerContent}>
          <Grid item xs={12} className={styles.footerSection}>
            <Box className={styles.footerLinks}>
              <Link to="/" className={styles.footerLink} aria-label="Home">الرئيسية</Link>
              <Link to="/anime-list" className={styles.footerLink} aria-label="Anime List">قائمة الأنمي</Link>
              <Link to="/movie-list" className={styles.footerLink} aria-label="Movie List">قائمة الأفلام</Link>
              <Link to="/recent-episodes" className={styles.footerLink} aria-label="Recent Episodes">آخر الحلقات</Link>
            </Box>
            <div className={styles.socialIcons}>
              <IconButton 
                href="https://www.facebook.com/people/Anime-Shadows/61563869637267/" 
                aria-label="Facebook" 
                className={styles.socialIcon}
                size="large"
              >
                <Facebook fontSize="inherit" />
              </IconButton>
              <IconButton 
                href="#" 
                aria-label="Twitter" 
                className={styles.socialIcon}
                size="large"
              >
                <Twitter fontSize="inherit" />
              </IconButton>
              <IconButton 
                href="https://www.youtube.com/channel/UCWGWPX03RG-FmbGHDHb14aA" 
                aria-label="YouTube" 
                className={styles.socialIcon}
                size="large"
              >
                <YouTube fontSize="inherit" />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <Typography variant="body2" className={styles.copyright}>
          &copy; {currentYear} Anime Shadows. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;