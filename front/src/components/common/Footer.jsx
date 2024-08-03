import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { Box, Container, Typography, IconButton } from '@mui/material';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" sx={{ backgroundColor: 'secondary.main', color: 'text.primary', py: 3 }}>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={2}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Link to="/about" style={{ textDecoration: 'none', color: 'text.secondary', padding: '12px' }}>About</Link>
                        <Link to="/privacy" style={{ textDecoration: 'none', color: 'text.secondary', padding: '12px' }}>Privacy</Link>
                        <Link to="/terms" style={{ textDecoration: 'none', color: 'text.secondary', padding: '12px' }}>Terms</Link>
                        <Link to="/contact" style={{ textDecoration: 'none', color: 'text.secondary', padding: '12px' }}>Contact</Link>
                        <Link to="/faq" style={{ textDecoration: 'none', color: 'text.secondary', padding: '12px' }}>FAQ</Link>
                    </Box>
                    <Box display="flex" gap={2}>
                        <IconButton href="#" aria-label="Facebook" sx={{ color: 'secondary.main', width: 48, height: 48 }}>
                            <Facebook fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Twitter" sx={{ color: 'secondary.main', width: 48, height: 48 }}>
                            <Twitter fontSize="small" />
                        </IconButton>
                        <IconButton href="#" aria-label="Instagram" sx={{ color: 'secondary.main', width: 48, height: 48 }}>
                            <Instagram fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <Box textAlign="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        &copy; {currentYear} Anime Shadows. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;