import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Box, Container, Typography, IconButton } from '@mui/material';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" className={styles.footer}>
            <Container maxWidth="lg" className={styles.container}>
                <Box className={styles.footerContent}>
                    <Box className={styles.footerNav}>
                        <Link to="/about" className={styles.footerLink}>About</Link>
                        <Link to="/privacy" className={styles.footerLink}>Privacy</Link>
                        <Link to="/terms" className={styles.footerLink}>Terms</Link>
                        <Link to="/contact" className={styles.footerLink}>Contact</Link>
                        <Link to="/faq" className={styles.footerLink}>FAQ</Link>
                    </Box>
                    <Box className={styles.socialIcons}>
                        <IconButton href="#" aria-label="Facebook" className={styles.socialIcon}>
                            <Facebook fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Twitter" className={styles.socialIcon}>
                            <Twitter fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Instagram" className={styles.socialIcon}>
                            <Instagram fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <Box className={styles.footerBottom}>
                    <Typography variant="body2" className={styles.copyright}>
                        &copy; {currentYear} Anime Shadows. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;