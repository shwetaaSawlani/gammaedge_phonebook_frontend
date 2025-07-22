import { configureStore } from '@reduxjs/toolkit';
import contactReducer from '../features/contacts/contactSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    contacts: contactReducer,
    auth: authReducer
  },
});
