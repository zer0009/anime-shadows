import React from 'react';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';
import styles from './BreadcrumbsComponent.module.css';

const BreadcrumbsComponent = ({ links, current }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className={styles.breadcrumbsWrapper}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" className={styles.separator} />}
        aria-label="breadcrumb"
        className={styles.breadcrumbs}
      >
        <RouterLink to="/" className={styles.link}>
          <HomeIcon className={styles.icon} />
          <Typography variant="body2">
            {t('common.home', 'Home')}
          </Typography>
        </RouterLink>
        {links.map((link, index) => (
          <MuiLink
            key={index}
            component={RouterLink}
            to={link.to}
            className={styles.link}
          >
            <Typography variant="body2">
              {link.label}
            </Typography>
          </MuiLink>
        ))}
        <Typography variant="body2" className={styles.current}>
          {current}
        </Typography>
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComponent;