import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Person, PersonAdd, ExitToApp, AccountCircle, History, Favorite, Dashboard, Menu, Close, Home, List, Movie, Tv } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector(`.${styles.header}`);
            if (window.scrollY > 50) {
                header.classList.add(styles.scrolled);
            } else {
                header.classList.remove(styles.scrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    const defaultProfilePicture = '/assets/images/default-profile-picture.jpg';

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} aria-label={t('header.homeLink')}>
                    <h1 className={styles.headerTitle}>Anime Shadows</h1>
                </Link>
                <nav className={`${styles.headerNav} ${menuOpen ? styles.open : ''}`} ref={menuRef}>
                    <button 
                        className={styles.closeMenuButton}
                        onClick={() => setMenuOpen(false)}
                        aria-label={t('header.closeMenu')}
                    >
                        <Close />
                    </button>
                    <ul className={styles.navList}>
                        <li>
                            <Link to="/" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                                <Home className={styles.navIcon} />
                                <span>{t('header.home')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/anime-list" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                                <List className={styles.navIcon} />
                                <span>{t('header.animeList')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/movie-list" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                                <Movie className={styles.navIcon} />
                                <span>{t('header.movieList')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/season-anime" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                                <Tv className={styles.navIcon} />
                                <span>{t('header.seasonAnime')}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className={styles.headerIcons}>
                    <Link to="/search" className={styles.searchIconButton} aria-label={t('header.search')}>
                        <Search className={styles.icon} />
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login" className={styles.authLink} aria-label={t('header.login')}>
                                <Person className={styles.icon} />
                                <span className={styles.authText}>{t('header.login')}</span>
                            </Link>
                            <Link to="/register" className={styles.authLink} aria-label={t('header.register')}>
                                <PersonAdd className={styles.icon} />
                                <span className={styles.authText}>{t('header.register')}</span>
                            </Link>
                        </>
                    ) : (
                        <div className={styles.userProfile} ref={dropdownRef}>
                            <button 
                                onClick={toggleDropdown}
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                                className={styles.profileButton}
                            >
                                <img
                                    src={user.profilePicture || defaultProfilePicture}
                                    alt=""
                                    className={styles.profilePicture}
                                    onError={(e) => { e.target.src = defaultProfilePicture; }}
                                />
                                <span className={styles.username}>{user.username}</span>
                            </button>
                            {dropdownOpen && (
                                <div className={`${styles.dropdownMenu} ${styles.open}`} role="menu">
                                    <Link to="/profile" role="menuitem" onClick={() => setDropdownOpen(false)}><AccountCircle /> {t('header.profile')}</Link>
                                    <Link to="/history" role="menuitem" onClick={() => setDropdownOpen(false)}><History /> {t('header.history')}</Link>
                                    <Link to="/favorites" role="menuitem" onClick={() => setDropdownOpen(false)}><Favorite /> {t('header.favorites')}</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin-dashboard" role="menuitem" onClick={() => setDropdownOpen(false)}><Dashboard /> {t('header.adminDashboard')}</Link>
                                    )}
                                    <button onClick={handleLogout} role="menuitem"><ExitToApp /> {t('header.logout')}</button>
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                        className={styles.menuIcon} 
                        onClick={toggleMenu}
                        aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
                        aria-expanded={menuOpen}
                    >
                        <Menu />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;