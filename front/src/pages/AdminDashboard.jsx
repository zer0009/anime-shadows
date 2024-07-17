import React from 'react';
import { Container, Typography, Grid, Paper, Box, Tabs, Tab } from '@mui/material';
import AddAnime from '../components/admin/AddAnime';
import AddEpisode from '../components/admin/AddEpisode';
import AddType from '../components/admin/AddType';
import AddGenre from '../components/admin/AddGenre';
import ManageAnime from '../components/admin/ManageAnime';
import EditEpisode from '../components/admin/EditEpisodes';
import EditType from '../components/admin/EditType';
import EditGenre from '../components/admin/EditGenre';
import RemoveAnime from '../components/admin/RemoveAnime';
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
              color: 'rgba(0, 0, 0, 0.6)', // Unselected tab color
            },
            '& .Mui-selected': {
              color: '#1976d2', // Selected tab color
            },
          }}
        >
          <Tab label="Add Anime" style={{ color: tabIndex === 0 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Add Episode" style={{ color: tabIndex === 1 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Add Type" style={{ color: tabIndex === 2 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Add Genre" style={{ color: tabIndex === 3 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Manage Anime" style={{ color: tabIndex === 4 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Edit Episode" style={{ color: tabIndex === 5 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Edit Type" style={{ color: tabIndex === 7 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Edit Genre" style={{ color: tabIndex === 8 ? '#1976d2' : '#d6b2ef' }}/>
          <Tab label="Remove Anime" style={{ color: tabIndex === 9 ? '#1976d2' : '#d6b2ef' }}/>
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
              <AddEpisode />
            </Paper>
          </Grid>
        )}
        {tabIndex === 2 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddType />
            </Paper>
          </Grid>
        )}
        {tabIndex === 3 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <AddGenre />
            </Paper>
          </Grid>
        )}
        {tabIndex === 4 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <ManageAnime />
            </Paper>
          </Grid>
        )}
        {tabIndex === 5 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <EditEpisode />
            </Paper>
          </Grid>
        )}
        {tabIndex === 7 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <EditType />
            </Paper>
          </Grid>
        )}
        {tabIndex === 8 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <EditGenre />
            </Paper>
          </Grid>
        )}
        {tabIndex === 9 && (
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <RemoveAnime />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;