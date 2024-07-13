import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; 2024 Anime Shadows. All rights reserved.</p>
                <nav className={styles.footerNav}>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/anime-list">Anime List</a></li>
                        <li><a href="/movie-list">Movie List</a></li>
                        <li><a href="/season-anime">Season Anime</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;