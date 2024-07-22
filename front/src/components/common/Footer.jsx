import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const footerHeight = document.querySelector(`.${styles.footer}`).offsetHeight;

            if (scrollTop + windowHeight >= documentHeight - footerHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <footer className={`${styles.footer} ${isVisible ? styles.visible : ''}`}>
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