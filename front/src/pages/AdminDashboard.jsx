import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import AddAnime from '../components/admin/AddAnime';
import AddEpisode from '../components/admin/AddEpisode';
import AddCategory from '../components/admin/AddCategory';
import AddType from '../components/admin/AddType';
import AddGenre from '../components/admin/AddGenre';
import EditAnime from '../components/admin/EditAnime';
import EditEpisode from '../components/admin/EditEpisode';
import EditCategory from '../components/admin/EditCategory';
import EditType from '../components/admin/EditType';
import EditGenre from '../components/admin/EditGenre';
import RemoveAnime from '../components/admin/RemoveAnime';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  return (
    <Container className={styles.adminDashboard}>
      <Typography variant="h4" className={styles.title}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <AddAnime />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <AddEpisode />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <AddCategory />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <AddType />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <AddGenre />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <EditAnime />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <EditEpisode />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <EditCategory />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <EditType />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <EditGenre />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={styles.paper}>
            <RemoveAnime />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;