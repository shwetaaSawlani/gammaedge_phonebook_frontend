
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/v1/user/generatetoken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
             
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Refresh token expired or invalid. Please log in again.");
                }
                throw new Error(errorData.message || 'Failed to refresh access token.');
            }

            const data = await response.json();
            console.log("Refreshed Token Response Data:", data);

            return data.data.user; 
        } catch (error) {
            return rejectWithValue(error.message || 'Token refresh failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/v1/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Session expired or invalid. Please log in again.");
                }
                throw new Error(errorData.message || 'Something went wrong.');
            }

            const data = await response.json();
            console.log("Signup Response Data:", data);

            return data.data.user;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to register user');
        }
    }
);

export const signinUser = createAsyncThunk(
    'auth/signinUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/v1/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Session expired or invalid. Please log in again.");
                }
                throw new Error(errorData.message || 'Something went wrong.');
            }

            const data = await response.json();
            console.log("Signin Response Data:", data);

            return data.data.user;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch('/api/v1/user/logout', {
                method: 'POST',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 204 || response.ok) {

                dispatch(clientLogout());
                return true;
            } else {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                if (response.status === 401 || response.status === 403) {
                    dispatch(clientLogout());
                }
                throw new Error(errorData.message || 'Logout failed on server');
            }
        } catch (error) {
            console.error("Logout API call failed:", error.message);
            dispatch(clientLogout()); 
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true, 
        error: null,
         isRefreshingToken: false,
    },
    reducers: {
        clientLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setAuthData: (state, action) => {
            state.user = action.payload.user || null;
            state.isAuthenticated = !!action.payload.user;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                console.error("Signup Rejected:", action.payload);
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Signup failed';
            })
            .addCase(signinUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signinUser.rejected, (state, action) => {
                console.error("Signin Rejected:", action.payload);
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                console.error("Logout Rejected:", action.payload);
                state.loading = false;
                state.error = action.payload || 'Logout failed';
            })
      
           
            .addCase(refreshAccessToken.pending, (state) => {
                state.isRefreshingToken = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                       state.isRefreshingToken = false; 
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                console.error("Token Refresh Rejected:", action.payload);
                state.loading = false;
                     state.isRefreshingToken = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || 'Token refresh failed';
            });

        
    },
});

export const { clientLogout, setAuthData } = authSlice.actions;
export default authSlice.reducer;