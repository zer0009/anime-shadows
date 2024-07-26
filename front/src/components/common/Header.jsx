import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Person, PersonAdd, ExitToApp, AccountCircle, History, Favorite, Dashboard } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    const defaultProfilePicture = '/assets/images/default-profile-picture.jpg';

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                {/* <h1 className={styles.headerTitle}>Anime Shadows</h1> */}
                <img src="/assets/images/anime-shadows-logo.png" alt="Anime Shadows" className={styles.headerLogo} />
                </Link>
                <nav className={styles.headerNav}>
                    <ul>
                        <li><Link to="/">{t('header.home')}</Link></li>
                        <li><Link to="/anime-list">{t('header.animeList')}</Link></li>
                        <li><Link to="/movie-list">{t('header.movieList')}</Link></li>
                        <li><Link to="/season-anime">{t('header.seasonAnime')}</Link></li>
                    </ul>
                </nav>
                <div className={styles.headerIcons}>
                    <Link to="/search" className={styles.searchIconButton}>
                        <Search className={styles.icon} />
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login"><Person className={styles.icon} /></Link>
                            <Link to="/register"><PersonAdd className={styles.icon} /></Link>
                        </>
                    ) : (
                        <div className={styles.userProfile} ref={dropdownRef}>
                            <img
                                src={user.profilePicture || defaultProfilePicture}
                                alt="Profile"
                                className={styles.profilePicture}
                                onError={(e) => { e.target.src = defaultProfilePicture; }}
                                onClick={toggleDropdown}
                            />
                            <span className={styles.username} onClick={toggleDropdown}>{user.username}</span>
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <Link to="/profile"><AccountCircle /> {t('header.profile')}</Link>
                                    <Link to="/history"><History /> {t('header.history')}</Link>
                                    <Link to="/favorites"><Favorite /> {t('header.favorites')}</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin-dashboard"><Dashboard /> {t('header.adminDashboard')}</Link>
                                    )}
                                    <button onClick={handleLogout}><ExitToApp /> {t('header.logout')}</button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className={styles.languageSwitcher}>
                        <button onClick={() => changeLanguage('en')}>EN</button>
                        <button onClick={() => changeLanguage('ar')}>AR</button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;