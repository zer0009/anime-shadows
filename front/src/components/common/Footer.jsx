import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Box, Container, Typography, IconButton, Grid } from '@mui/material';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" className={styles.footer}>
            <Container maxWidth="lg" className={styles.container}>
                <Grid container spacing={4} className={styles.footerContent}>
                    <Grid item xs={12} md={4} className={styles.footerSection}>
                        <Typography variant="h6" className={styles.footerTitle}>Anime Shadows</Typography>
                        <IconButton href="#" aria-label="Facebook" className={styles.socialIcon}>
                            <Facebook fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Twitter" className={styles.socialIcon}>
                            <Twitter fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Instagram" className={styles.socialIcon}>
                            <Instagram fontSize="small" />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.footerSection}>
                        <Box className={styles.footerLinks}>
                            <Link to="/" className={styles.footerLink}>الرئيسية</Link>
                            <Link to="/anime-list" className={styles.footerLink}>قائمة الأنمي</Link>
                            <Link to="/movie-list" className={styles.footerLink}>قائمة الأفلام</Link>
                            <Link to="/recent-episodes" className={styles.footerLink}>آخر الحلقات</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} className={styles.footerSection}>
                        <Typography variant="body2" className={styles.footerNotice}>
                            تنويه: هذا الموقع لا يقوم بتخزين أي ملفات على الخادم الخاص به.
                        </Typography>
                        <Typography variant="body2" className={styles.footerNotice}>
                            يتم توفير جميع المحتويات من قبل أطراف ثالثة غير تابعة.
                        </Typography>
                    </Grid>
                </Grid>
                    <Typography variant="body2" className={styles.copyright}>
                        &copy; {currentYear} Anime Shadows. All rights reserved
                    </Typography>
            </Container>
        </Box>
    );
};

export default Footer;