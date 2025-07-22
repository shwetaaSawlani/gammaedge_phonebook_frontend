
import  { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, logoutUser } from './features/auth/authSlice';
import Auth from './components/Auth';
import PhonebookApp from './PhonebookApp';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';

import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return isAuthenticated ? children : <Navigate to="/auth/signin" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {

    dispatch(refreshAccessToken());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const displayName = (user && user.name  && user.name.trim() !== '') ? user.name : 'User';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My Phonebook App ☎
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>

            {isAuthenticated ? (
              <>
                <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                                    Welcome, {displayName} 😄
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                                    Logout🔚
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/auth/signin')}>
                                    SIGN IN➡
                </Button>
                <Button color="inherit" onClick={() => navigate('/auth/signup')}>
                                    SIGN UP⬆
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>

        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/phonebook" /> : <Navigate to="/auth/signin" />}
        />
        <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/phonebook"
          element={
            <ProtectedRoute>
              <PhonebookApp />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/phonebook' : '/auth/signin'} />}
        />
      </Routes>
    </>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
