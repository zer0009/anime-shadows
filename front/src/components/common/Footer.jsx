import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; 2024 Anime Shadows. All rights reserved.</p>
                <nav className={styles.footerNav}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/anime-list">Anime List</Link></li>
                        <li><Link to="/movie-list">Movie List</Link></li>
                        <li><Link to="/season-anime">Season Anime</Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;