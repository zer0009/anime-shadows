import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Person, PersonAdd, ExitToApp, AccountCircle, History, Favorite, Dashboard, Menu, Close, Home, Movie, Tv, Theaters } from '@mui/icons-material';
import { AppBar, Toolbar, IconButton, Typography, Button, Popover, Box, Avatar, CircularProgress, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { useTheme } from '@mui/material/styles';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDropdown = (event) => {
        setAnchorEl(event.currentTarget);
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(!menuOpen);
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
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
        const handleScroll = debounce(() => {
            const header = document.querySelector('.MuiAppBar-root');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    const defaultProfilePicture = '/assets/images/default-profile-picture.jpg';

    return (
        <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, var(--primary-dark) 20%, var(--tertiary-dark) 80%)', transition: 'all 0.3s ease' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                        Anime Shadows
                    </Typography>
                    {!isMobile && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button component={Link} to="/" color="inherit" startIcon={<Home />} sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.home')}>{t('header.home')}</Button>
                            <Button component={Link} to="/anime-list" color="inherit" startIcon={<Theaters />} sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.animeList')}>{t('header.animeList')}</Button>
                            <Button component={Link} to="/movie-list" color="inherit" startIcon={<Movie />} sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.movieList')}>{t('header.movieList')}</Button>
                            <Button component={Link} to="/season-anime" color="inherit" startIcon={<Tv />} sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.seasonAnime')}>{t('header.seasonAnime')}</Button>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton component={Link} to="/search" color="inherit" aria-label={t('header.search')} sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }}>
                            <Search />
                        </IconButton>
                        {!user ? (
                            <>
                                <Button component={Link} to="/login" color="inherit" startIcon={<Person />} sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }} aria-label={t('header.login')}>{t('header.login')}</Button>
                                <Button component={Link} to="/register" color="inherit" startIcon={<PersonAdd />} sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }} aria-label={t('header.register')}>{t('header.register')}</Button>
                            </>
                        ) : (
                            <Box display="flex" alignItems="center">
                                <IconButton onClick={toggleDropdown} ref={menuRef} color="inherit" sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }} aria-label={t('header.profileMenu')}>
                                    <Avatar src={user.profilePicture || defaultProfilePicture} alt="" />
                                </IconButton>
                                <Popover
                                    open={dropdownOpen}
                                    anchorEl={anchorEl}
                                    onClose={() => setDropdownOpen(false)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <List sx={{ p: 2, backgroundColor: 'var(--primary-dark)', color: 'white' }}>
                                        <ListItem button component={Link} to="/profile" onClick={() => setDropdownOpen(false)} aria-label={t('header.profile')}>
                                            <ListItemIcon sx={{ color: 'white' }}><AccountCircle /></ListItemIcon>
                                            <ListItemText primary={t('header.profile')} />
                                        </ListItem>
                                        <ListItem button component={Link} to="/history" onClick={() => setDropdownOpen(false)} aria-label={t('header.history')}>
                                            <ListItemIcon sx={{ color: 'white' }}><History /></ListItemIcon>
                                            <ListItemText primary={t('header.history')} />
                                        </ListItem>
                                        <ListItem button component={Link} to="/favorites" onClick={() => setDropdownOpen(false)} aria-label={t('header.favorites')}>
                                            <ListItemIcon sx={{ color: 'white' }}><Favorite /></ListItemIcon>
                                            <ListItemText primary={t('header.favorites')} />
                                        </ListItem>
                                        {user.role === 'admin' && (
                                            <ListItem button component={Link} to="/admin-dashboard" onClick={() => setDropdownOpen(false)} aria-label={t('header.adminDashboard')}>
                                                <ListItemIcon sx={{ color: 'white' }}><Dashboard /></ListItemIcon>
                                                <ListItemText primary={t('header.adminDashboard')} />
                                            </ListItem>
                                        )}
                                        <ListItem button onClick={handleLogout} aria-label={t('header.logout')}>
                                            <ListItemIcon sx={{ color: 'white' }}><ExitToApp /></ListItemIcon>
                                            <ListItemText primary={loading ? <CircularProgress size={24} /> : t('header.logout')} />
                                        </ListItem>
                                    </List>
                                </Popover>
                            </Box>
                        )}
                        <IconButton edge="end" color="inherit" onClick={toggleMenu} sx={{ display: { md: 'none' }, color: 'white', '&:hover': { color: 'var(--highlight-color)' } }} aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}>
                            {menuOpen ? <Close /> : <Menu />}
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
            <Popover
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={() => setMenuOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    style: {
                        width: '100%',
                        maxWidth: 'none',
                        transform: 'translateY(0)',
                        backgroundColor: 'var(--primary-dark)',
                        color: 'white',
                    },
                }}
            >
                <List sx={{ p: 2 }}>
                    <ListItem button component={Link} to="/" onClick={() => setMenuOpen(false)} aria-label={t('header.home')}>
                        <ListItemIcon sx={{ color: 'white' }}><Home /></ListItemIcon>
                        <ListItemText primary={t('header.home')} />
                    </ListItem>
                    <ListItem button component={Link} to="/anime-list" onClick={() => setMenuOpen(false)} aria-label={t('header.animeList')}>
                        <ListItemIcon sx={{ color: 'white' }}><Theaters /></ListItemIcon>
                        <ListItemText primary={t('header.animeList')} />
                    </ListItem>
                    <ListItem button component={Link} to="/movie-list" onClick={() => setMenuOpen(false)} aria-label={t('header.movieList')}>
                        <ListItemIcon sx={{ color: 'white' }}><Movie /></ListItemIcon>
                        <ListItemText primary={t('header.movieList')} />
                    </ListItem>
                    <ListItem button component={Link} to="/season-anime" onClick={() => setMenuOpen(false)} aria-label={t('header.seasonAnime')}>
                        <ListItemIcon sx={{ color: 'white' }}><Tv /></ListItemIcon>
                        <ListItemText primary={t('header.seasonAnime')} />
                    </ListItem>
                </List>
            </Popover>
        </AppBar>
    );
};

export default Header;