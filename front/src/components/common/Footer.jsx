import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <nav className={styles.footerNav}>
                        <Link to="/about">About</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/faq">FAQ</Link>
                    </nav>
                    <div className={styles.socialIcons}>
                        <a href="#" aria-label="Facebook"><Facebook fontSize="small" /></a>
                        <a href="#" aria-label="Twitter"><Twitter fontSize="small" /></a>
                        <a href="#" aria-label="Instagram"><Instagram fontSize="small" /></a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>&copy; {currentYear} Anime Shadows. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;