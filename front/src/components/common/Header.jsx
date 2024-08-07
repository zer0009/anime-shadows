import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Person, PersonAdd, ExitToApp, AccountCircle, History, Favorite, Dashboard, Menu, Close, Home, Movie, Tv, Theaters, Language, WatchLater } from '@mui/icons-material';
import { AppBar, Toolbar, IconButton, Typography, Button, Popover, Box, Avatar, CircularProgress, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, Drawer, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { useTheme } from '@mui/material/styles';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [authPopoverOpen, setAuthPopoverOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDropdown = (event) => {
        setAnchorEl(event.currentTarget);
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleAuthPopover = (event) => {
        setAnchorEl(event.currentTarget);
        setAuthPopoverOpen(!authPopoverOpen);
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
        <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1a237e 20%, #8e24aa 80%)', transition: 'all 0.3s ease' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                        Anime Shadows
                    </Typography>
                    {!isMobile && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button component={Link} to="/" color="inherit" startIcon={<Home />} sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.home')}>{t('header.home')}</Button>
                            <Button component={Link} to="/anime-list" color="inherit" sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.animeList')}>{t('header.animeList')}</Button>
                            <Button component={Link} to="/movie-list" color="inherit" sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.movieList')}>{t('header.movieList')}</Button>
                            <Button component={Link} to="/season-anime" color="inherit" sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', '&:hover': { color: 'var(--highlight-color)' }, '& .MuiButton-startIcon': { marginLeft: '8px' } }} aria-label={t('header.seasonAnime')}>{t('header.seasonAnime')}</Button>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton component={Link} to="/search" color="inherit" aria-label={t('header.search')} sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }}>
                            <Search />
                        </IconButton>
                        {!user ? (
                            <>
                                <IconButton onClick={toggleAuthPopover} color="inherit" sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }} aria-label={t('header.authMenu')}>
                                    <Person />
                                </IconButton>
                                <Popover
                                    open={authPopoverOpen}
                                    anchorEl={anchorEl}
                                    onClose={() => setAuthPopoverOpen(false)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    PaperProps={{
                                        style: {
                                            width: '200px',
                                            backgroundColor: 'var(--primary-dark)',
                                            color: 'white',
                                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <List sx={{ p: 2 }}>
                                        <ListItem button component={Link} to="/login" onClick={() => setAuthPopoverOpen(false)} aria-label={t('header.login')}>
                                            <ListItemIcon sx={{ color: 'white' }}><Person /></ListItemIcon>
                                            <ListItemText primary={t('header.login')} />
                                        </ListItem>
                                        <ListItem button component={Link} to="/register" onClick={() => setAuthPopoverOpen(false)} aria-label={t('header.register')}>
                                            <ListItemIcon sx={{ color: 'white' }}><PersonAdd /></ListItemIcon>
                                            <ListItemText primary={t('header.register')} />
                                        </ListItem>
                                    </List>
                                </Popover>
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
                                    PaperProps={{
                                        style: {
                                            width: '200px',
                                            backgroundColor: 'var(--primary-dark)',
                                            color: 'white',
                                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <List sx={{ p: 2 }}>
                                        <ListItem button component={Link} to="/profile" onClick={() => setDropdownOpen(false)} aria-label={t('header.profile')}>
                                            <ListItemIcon sx={{ color: 'white' }}><AccountCircle /></ListItemIcon>
                                            <ListItemText primary={t('header.profile')} />
                                        </ListItem>
                                        <ListItem button component={Link} to="/last-watching" onClick={() => setDropdownOpen(false)} aria-label={t('header.history')}>
                                            <ListItemIcon sx={{ color: 'white' }}><History /></ListItemIcon>
                                            <ListItemText primary={t('header.lastWatching')} />
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
                        <IconButton edge="end" color="inherit" onClick={toggleMenu} sx={{ display: { md: 'none' }, color: 'white', '&:hover': { color: 'var(--highlight-color)' }, marginLeft: 'auto' }} aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}>
                            {menuOpen ? <Close /> : <Menu />}
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
            <Drawer
                anchor="right"
                open={menuOpen}
                onClose={toggleMenu}
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    style: {
                        width: '250px',
                        background: 'linear-gradient(135deg, #2a0f47, #8f2b88)',
                        color: 'white',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <IconButton onClick={toggleMenu} sx={{ color: 'white', '&:hover': { color: 'var(--highlight-color)' } }}>
                        <Close />
                    </IconButton>
                    <List>
                        <ListItem button component={Link} to="/" onClick={toggleMenu} aria-label={t('header.home')}>
                            <ListItemIcon sx={{ color: 'white' }}><Home /></ListItemIcon>
                            <ListItemText primary={t('header.home')} />
                        </ListItem>
                        <ListItem button component={Link} to="/anime-list" onClick={toggleMenu} aria-label={t('header.animeList')}>
                            <ListItemIcon sx={{ color: 'white' }}><Theaters /></ListItemIcon>
                            <ListItemText primary={t('header.animeList')} />
                        </ListItem>
                        <ListItem button component={Link} to="/movie-list" onClick={toggleMenu} aria-label={t('header.movieList')}>
                            <ListItemIcon sx={{ color: 'white' }}><Movie /></ListItemIcon>
                            <ListItemText primary={t('header.movieList')} />
                        </ListItem>
                        <ListItem button component={Link} to="/season-anime" onClick={toggleMenu} aria-label={t('header.seasonAnime')}>
                            <ListItemIcon sx={{ color: 'white' }}><Tv /></ListItemIcon>
                            <ListItemText primary={t('header.seasonAnime')} />
                        </ListItem>
                        <ListItem button component={Link} to="/last-watching" onClick={toggleMenu} aria-label={t('header.lastWatching')}>
                            <ListItemIcon sx={{ color: 'white' }}><WatchLater /></ListItemIcon>
                            <ListItemText primary={t('header.lastWatching')} />
                        </ListItem>
                        <ListItem button component={Link} to="/favorites" onClick={toggleMenu} aria-label={t('header.favorites')}>
                            <ListItemIcon sx={{ color: 'white' }}><Favorite /></ListItemIcon>
                            <ListItemText primary={t('header.favorites')} />
                        </ListItem>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <ListItem button onClick={() => changeLanguage('en')} aria-label="Change language to English">
                            <ListItemIcon sx={{ color: 'white' }}><Language /></ListItemIcon>
                            <ListItemText primary="English" />
                        </ListItem>
                        <ListItem button onClick={() => changeLanguage('ar')} aria-label="Change language to Arabic">
                            <ListItemIcon sx={{ color: 'white' }}><Language /></ListItemIcon>
                            <ListItemText primary="العربية" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Header;