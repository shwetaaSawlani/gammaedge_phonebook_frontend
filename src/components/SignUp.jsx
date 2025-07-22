
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../features/auth/authSlice';
import { TextField, Button, Typography, Box, Paper, CircularProgress, Alert, Grid } from '@mui/material';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) {
      navigate('/phonebook');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|`~-]).{6,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
                'Password must be at least 6 characters long and include: 1 uppercase, 1 lowercase, 1 digit, and 1 special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(signupUser(formData));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Grid
        container
        component={Paper}
        elevation={6}
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
            minHeight: 400,
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
                            Join Our Community!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                            Create your account to manage contacts
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.password}
                helperText={errors.password}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </form>
            <Typography variant="body2" align="center">
                            Already have an account?{' '}
              <Button onClick={() => navigate('/auth/signin')} size="small">
                                SIGN IN
              </Button>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
