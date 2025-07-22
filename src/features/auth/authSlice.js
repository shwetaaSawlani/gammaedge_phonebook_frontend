
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const authApiCall = async (url, method = 'GET', body = null, isJson = true) => {
  const options = {
    method,
    credentials: 'include',
  };

  if (body) {
    if (isJson) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
  }

  const response = await fetch(url, options);

  if (response.status === 204 || response.status === 200 && !response.headers.get('content-type')) {
    return { success: true, status: response.status };
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));

    if (response.status === 401 || response.status === 403) {
      throw new Error(errorData.message || 'session expired.');
    }
    throw new Error(errorData.message || 'Something went wrong with the request.');
  }

  const data = await response.json();
  return data;
};

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApiCall('/api/v1/user/generatetoken', 'POST');

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
      const data = await authApiCall('/api/v1/user/register', 'POST', userData);

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
      const data = await authApiCall('/api/v1/user/login', 'POST', credentials);
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
      await authApiCall('/api/v1/user/logout', 'POST');

      dispatch(clientLogout());
      return true;
    } catch (error) {
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
        console.error('Signup Rejected:', action.payload);
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
        console.error('Signin Rejected:', action.payload);
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
        console.error('Logout Rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      })

      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        console.error('Token Refresh Rejected:', action.payload);
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Token refresh failed';
      });
  },
});

export const { clientLogout, setAuthData } = authSlice.actions;
export default authSlice.reducer;
