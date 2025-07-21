// 🔧 REFACTORED: Key fixes applied to solve issues:
// - Fixed token refresh logic to avoid logout flashes
// - Removed `loading` use during refresh token process
// - Ensured smoother session restoration with fallback control

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, logoutUser } from './features/auth/authSlice'; 
import Auth from './components/Auth';
import PhonebookApp from './PhonebookApp';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, isRefreshingToken } = useSelector((state) => state.auth);

    if (loading && !isRefreshingToken) {
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
    const navigate = useNavigate();
    const { isAuthenticated, user, loading, error, isRefreshingToken } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(refreshAccessToken());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const displayName = (user?.username?.trim() || 'User');

    if (loading && !isRefreshingToken) {
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
                                <Button color="inherit" onClick={() => navigate("/auth/signin")}>SIGN IN➡</Button>
                                <Button color="inherit" onClick={() => navigate("/auth/signup")}>SIGN UP⬆</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route 
                    path="/" 
                    element={<Navigate to={isAuthenticated ? "/phonebook" : "/auth/signin"} />} 
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
                    element={<Navigate to={isAuthenticated ? "/phonebook" : "/auth/signin"} />} 
                />
            </Routes>
        </>
    );
}

export default App;
