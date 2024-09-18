import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon, Movie as MovieIcon, Category as CategoryIcon, Theaters as TheatersIcon, People as PeopleIcon } from '@mui/icons-material';
import ManageAnime from '../components/admin/ManageAnime';
import AddAnime from '../components/admin/AddAnime';
import AddType from '../components/admin/AddType';
import AddGenre from '../components/admin/AddGenre';
import AddSeason from '../components/admin/AddSeason';
import ManageUsers from '../components/admin/ManageUsers';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const tabComponents = [
    { label: 'Manage Anime', icon: <MovieIcon />, component: ManageAnime },
    { label: 'Add Anime', icon: <AddIcon />, component: AddAnime },
    { label: 'Add Type', icon: <CategoryIcon />, component: AddType },
    { label: 'Add Genre', icon: <TheatersIcon />, component: AddGenre },
    { label: 'Add Season', icon: <AddIcon />, component: AddSeason },
    ...(isAdmin ? [{ label: 'Manage Users', icon: <PeopleIcon />, component: ManageUsers }] : []),
  ];

  const renderComponent = () => {
    const Component = tabComponents[tabIndex].component;
    return <Component />;
  };

  return (
    <Container maxWidth="xl" className={styles.adminDashboard}>
      <Typography variant="h4" className={styles.title}>Admin Dashboard</Typography>
      <Box className={styles.dashboardContent}>
        <Box className={styles.tabContainer}>
          {isMobile && (
            <IconButton onClick={toggleMenu} className={styles.menuButton}>
              <MenuIcon />
            </IconButton>
          )}
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            textColor="primary"
            indicatorColor="primary"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            className={`${styles.tabs} ${isMobile && menuOpen ? styles.showTabs : ''}`}
          >
            {tabComponents.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                className={styles.tab}
              />
            ))}
          </Tabs>
        </Box>
        <Box className={styles.tabContent}>
          {renderComponent()}
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;