import React from 'react';
import { Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbsComponent = ({ links, current }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="medium" sx={{ color: 'var(--subtext-color)' }} />}
      aria-label="breadcrumb"
      sx={{
        marginBottom: '30px',
        padding: '10px 20px',
        backgroundColor: 'var(--secondary-dark)',
        borderRadius: '8px',
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        },
      }}
    >
      <RouterLink
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--subtext-color)',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          padding: '5px 10px',
          borderRadius: '4px',
          '&:hover': {
            color: 'var(--highlight-color)',
            backgroundColor: 'var(--hover-background-color)',
          },
        }}
      >
        <HomeIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
        <Typography variant="h6">
          Home
        </Typography>
      </RouterLink>
      {links.map((link, index) => (
        <MuiLink
          key={index}
          component={RouterLink}
          to={link.to}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--subtext-color)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            padding: '5px 10px',
            borderRadius: '4px',
            '&:hover': {
              color: 'var(--highlight-color)',
              backgroundColor: 'var(--hover-background-color)',
            },
          }}
        >
          <Typography variant="h6">
            {link.label}
          </Typography>
        </MuiLink>
      ))}
      <Typography
        variant="h6"
        sx={{
          color: 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '5px 10px',
        }}
      >
        {current}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;