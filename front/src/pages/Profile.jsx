import React from 'react';
import useFetchUserData from '../hooks/useFetchUserData';
import { Avatar, Box, Typography, Grid, Divider, ThemeProvider, createTheme } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import styles from './Profile.module.css';

// Create a theme instance for RTL support
const rtlTheme = createTheme({
  direction: 'rtl',
});

const Profile = () => {
    const { userData } = useFetchUserData();

    if (!userData) {
        return <Box className={styles.loadingContainer}>جاري التحميل...</Box>;
    }

    return (
        <ThemeProvider theme={rtlTheme}>
            <Box className={styles.profileContainer}>
                <Box className={styles.coverPhoto} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} className={styles.avatarSection}>
                        <Avatar
                            src={userData.avatar || '/assets/images/default-profile-picture.jpg'}
                            alt={userData.username}
                            className={styles.avatar}
                        />
                        <Typography variant="h5" className={styles.username}>
                            {userData.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8} className={styles.infoSection}>
                        <Typography variant="h6" className={styles.sectionTitle}>
                            نبذة عني
                        </Typography>
                        <Typography variant="body1" className={styles.bio}>
                            {userData.bio || "لا توجد نبذة متاحة"}
                        </Typography>
                        <Divider className={styles.divider} />
                        <Box className={styles.contactInfo}>
                            <Box className={styles.infoItem}>
                                <EmailIcon className={styles.infoIcon} />
                                <Typography variant="body1">{userData.email}</Typography>
                            </Box>
                            <Box className={styles.infoItem}>
                                <CalendarTodayIcon className={styles.infoIcon} />
                                <Typography variant="body1">
                                    تاريخ الانضمام: {new Date(userData.createdAt).toLocaleDateString('ar-EG')}
                                </Typography>
                            </Box>
                            <Box className={styles.infoItem}>
                                <WorkIcon className={styles.infoIcon} />
                                <Typography variant="body1">{userData.role}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

export default Profile;