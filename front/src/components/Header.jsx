// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth from AuthContext
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth(); // Get user and logout from AuthContext
    const [dropdownOpen, setDropdownOpen] = useState(false);

    console.log("Current user in Header:", user); // Debug log

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await logout(); // Call the context logout function to update the state
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <h1 className="header-title">Anime Shadows</h1>
                <nav className="header-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/anime-list">Anime List</Link></li>
                        <li><Link to="/movie-list">Movie List</Link></li>
                        <li><Link to="/season-anime">Season Anime</Link></li>
                    </ul>
                </nav>
                <div className="header-icons">
                    {!user ? (
                        <>
                            <Link to="/login"><FaUser className="icon" /></Link>
                            <Link to="/register"><FaUserPlus className="icon" /></Link>
                        </>
                    ) : (
                        <div className="user-profile">
                            <img src={user.profilePicture} alt="Profile" className="profile-picture" onClick={toggleDropdown} />
                            <span className="username" onClick={toggleDropdown}>{user.username}</span>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile">Profile</Link>
                                    <Link to="/settings">Settings</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                    <Link to="/search" className="search-icon-button">
                        <FaSearch className="icon" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;