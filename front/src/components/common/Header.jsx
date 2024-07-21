import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
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

    const defaultProfilePicture = '/assets/images/default-profile-picture.jpg';

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <h1 className={styles.headerTitle}>Anime Shadows</h1>
                <nav className={styles.headerNav}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/anime-list">Anime List</Link></li>
                        <li><Link to="/movie-list">Movie List</Link></li>
                        <li><Link to="/season-anime">Season Anime</Link></li>
                    </ul>
                </nav>
                <div className={styles.headerIcons}>
                    <Link to="/search" className={styles.searchIconButton}>
                        <FaSearch className={styles.icon} />
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login"><FaUser className={styles.icon} /></Link>
                            <Link to="/register"><FaUserPlus className={styles.icon} /></Link>
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
                                    <Link to="/profile">Profile</Link>
                                    <Link to="/history">History</Link>
                                    <Link to="/favorites">Favorites</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin-dashboard">Admin Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;