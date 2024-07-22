import React from 'react';
import { Container, Typography, Grid, Paper, Box, Tabs, Tab } from '@mui/material';
import AddAnime from '../components/admin/AddAnime';
import AddType from '../components/admin/AddType';
import AddGenre from '../components/admin/AddGenre';
import ManageAnime from '../components/admin/ManageAnime';
import AddSeason from '../components/admin/AddSeason';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container className={styles.adminDashboard}>
      <Typography variant="h4" className={styles.title}>Admin Dashboard</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
            '& .Mui-selected': {
              color: '#1976d2',
            },
          }}
        >
          <Tab label="Add Anime" style={{ color: 'white' }} />
          <Tab label="Add Type" style={{ color: 'white' }} />
          <Tab label="Add Genre" style={{ color: 'white' }} />
          <Tab label="Manage Anime" style={{ color: 'white' }} />
          <Tab label="Add Season" style={{ color: 'white' }} />
        </Tabs>
      </Box>
      <Grid container spacing={3} className={styles.tabContent}>
        {tabIndex === 0 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddAnime />
            </Paper>
          </Grid>
        )}
        {tabIndex === 1 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddType />
            </Paper>
          </Grid>
        )}
        {tabIndex === 2 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddGenre />
            </Paper>
          </Grid>
        )}
        {tabIndex === 3 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <ManageAnime />
            </Paper>
          </Grid>
        )}
        {tabIndex === 4 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddSeason />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
