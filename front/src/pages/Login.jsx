// src/pages/Login.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment, Paper, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuthForm from '../hooks/useAuthForm';
import styles from './Login.module.css';
import { styled } from '@mui/material/styles';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#e0e0e0',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#9e9e9e',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#7e57c2',
    },
    '&:hover fieldset': {
      borderColor: '#b39ddb',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d1c4e9',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#ffcdd2',
  },
}));

const Login = () => {
  const { handleLogin, error: authError } = useAuthForm();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs" className={styles.container}>
      <Paper elevation={10} className={styles.paper}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" className={styles.title}>
            Sign in
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Keep it all together and you'll be fine
          </Typography>
          {authError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {authError}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail or phone"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#9e9e9e' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" className={styles.forgotPassword}>
              Forgot Password
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={styles.submitButton}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;