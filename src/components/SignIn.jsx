
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signinUser } from '../features/auth/authSlice';
import { TextField, Button, Typography, Box, Paper, CircularProgress, Alert, Grid } from '@mui/material';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) {
      navigate('/phonebook');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signinUser(credentials));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        component={Paper}
        elevation={9}
        sx={{
          maxWidth: 900,
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >

        <Grid
          sx={{
            width: {
              sm: 'calc(100% / 12 * 5)',
              md: 'calc(100% / 12 * 6)',
            },
            backgroundImage: 'url(/images/phone.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.grey[50],
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            minHeight: 300,
          }}
        />

        <Grid
          sx={{
            width: {
              xs: '100%',
              sm: 'calc(100% / 12 * 7)',
              md: 'calc(100% / 12 * 6)',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ maxWidth: 350, width: '100%' }}>
            <Typography variant="h5" component="h1"  align="center">
                            Welcome Back!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary"  align="center" sx={{ mb: 3 }}>
                            Sign in to access your contacts
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
            <Typography variant="body2" align="center"> Don&#39;t have an account?{' '}
              <Button onClick={() => navigate('/auth/signup')} size="small">
                                SIGN UP
              </Button>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;
