import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { refreshAccessToken, logoutUser } from '../auth/authSlice'; 


const handleAuthError = async (originalThunk, thunkAPI, args) => {
    try {
        await thunkAPI.dispatch(refreshAccessToken()).unwrap();
        // If refresh is successful, retry the original failed thunk
        return await thunkAPI.dispatch(originalThunk(args)).unwrap();
    } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue("Session expired. Please log in again.");
    }
};

export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (params, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        const fetchData = async () => {
            const { page = 1, limit = 10, searchTerm, label } = params || {};
            let url = '';
            const queryParams = new URLSearchParams({ page, limit });

            if (searchTerm) {
                url = `/api/v1/contact/search/${encodeURIComponent(searchTerm)}`;
                if (label && label !== 'All') queryParams.append('label', label);
            } else if (label && label !== 'All') {
                url = `/api/v1/contact/getlabel/${encodeURIComponent(label)}`;
            } else {
                url = '/api/v1/contact/contactList';
            }

            const response = await fetch(`${url}?${queryParams.toString()}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                if ([401, 403].includes(response.status)) throw new Error("UNAUTHORIZED");
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || 'Failed to fetch contacts.');
            }

            const data = await response.json();
            return data.data;
        };

        try {
            return await fetchData();
        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                return await handleAuthError(fetchContacts, thunkAPI, params);
            }
            return rejectWithValue(error.message);
        }
    }
);


export const addContactToDB = createAsyncThunk(
    'contacts/addContactToDB',
    async (contactData, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        const fetchData = async () => {
            const formData = new FormData();
            Object.entries(contactData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            });

            const response = await fetch('/api/v1/contact/register', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if ([401, 403].includes(response.status)) throw new Error("UNAUTHORIZED");
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || 'Failed to add contact.');
            }

            const data = await response.json();
            return data.data;
        };

        try {
            return await fetchData();
        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                return await handleAuthError(addContactToDB, thunkAPI, contactData);
            }
            return rejectWithValue(error.message);
        }
    }
);


export const updateContactToDB = createAsyncThunk(
    'contacts/updateContactToDB',
    async ({ id, updatedData }, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        const fetchData = async () => {
            const formData = new FormData();
            Object.entries(updatedData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value);
                }
            });

            const response = await fetch(`/api/v1/contact/update/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if ([401, 403].includes(response.status)) throw new Error("UNAUTHORIZED");
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || 'Failed to update contact.');
            }

            const data = await response.json();
            return data.data;
        };

        try {
            return await fetchData();
        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                return await handleAuthError(updateContactToDB, thunkAPI, { id, updatedData });
            }
            return rejectWithValue(error.message);
        }
    }
);



export const deleteContactFromDB = createAsyncThunk(
    'contacts/deleteContactFromDB',
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        const fetchData = async () => {
            const response = await fetch(`/api/v1/contact/delete/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                if ([401, 403].includes(response.status)) throw new Error("UNAUTHORIZED");
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || 'Failed to delete contact.');
            }

            return id;
        };

        try {
            return await fetchData();
        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                return await handleAuthError(deleteContactFromDB, thunkAPI, id);
            }
            return rejectWithValue(error.message);
        }
    }
);


export const toggleBookmarkContact = createAsyncThunk(
    'contacts/toggleBookmarkContact',
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;

        const fetchData = async () => {
            const response = await fetch(`/api/v1/contact/update/bookmark/${encodeURIComponent(id)}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                if ([401, 403].includes(response.status)) throw new Error("UNAUTHORIZED");
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || 'Failed to toggle bookmark.');
            }

            const data = await response.json();
            return data.data || data;
        };

        try {
            return await fetchData();
        } catch (error) {
            if (error.message === "UNAUTHORIZED") {
                return await handleAuthError(toggleBookmarkContact, thunkAPI, id);
            }
            return rejectWithValue(error.message);
        }
    }
);





const contactSlice = createSlice({

    name: 'contacts',

    initialState: {

        data: [],
        currentPage: 1,
        itemsPerPage: 10,
        totalCount: 0,
        totalPages: 1,
        activeSearchTerm: '',
        activeLabel: '',
        loading: false,
        error: null,

    },

    reducers: {

        setPaginationParams: (state, action) => {

            const { page, limit, searchTerm, label } = action.payload;

            if (page !== undefined) state.currentPage = page;
            if (limit !== undefined) state.itemsPerPage = limit;
            if (searchTerm !== undefined) state.activeSearchTerm = searchTerm;
            if (label !== undefined) state.activeLabel = label;

        },

    },

    extraReducers: (builder) => {
        builder
              .addCase(fetchContacts.pending, (state, action) => { // action is available here
            
                    state.loading = true;
                
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                const { contacts, totalCount, currentPage, totalPages, limit } = action.payload;

                state.data = Array.isArray(contacts) ? contacts : [];
                state.totalCount = totalCount || 0;
                state.currentPage = currentPage || state.currentPage;
                state.totalPages = totalPages || 1;
                state.itemsPerPage = limit || state.itemsPerPage;
                state.error = null;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch contacts";
                state.data = [];
                state.totalCount = 0;
                state.totalPages = 1;
            })
            // addContactToDB Reducers
            .addCase(addContactToDB.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addContactToDB.fulfilled, (state) => { state.loading = false; })
            .addCase(addContactToDB.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to add contact'; })
            // updateContactToDB Reducers
            .addCase(updateContactToDB.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateContactToDB.fulfilled, (state, action) => {
                state.loading = false;
                const updatedContact = action.payload;
                state.data = state.data.map((c) =>
                    c._id === updatedContact._id ? updatedContact : c
                );
            })
            .addCase(updateContactToDB.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to update contact'; })
            // deleteContactFromDB Reducers
            .addCase(deleteContactFromDB.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteContactFromDB.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;
                state.data = state.data.filter((c) => c._id !== id);
            })
            .addCase(deleteContactFromDB.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Failed to delete contact'; })
            // toggleBookmarkContact Reducers
            .addCase(toggleBookmarkContact.pending, (state) => { state.error = null; })
            .addCase(toggleBookmarkContact.fulfilled, (state, action) => {
                const updatedContact = action.payload;
                if (!updatedContact || typeof updatedContact._id === 'undefined') {
                    state.error = "Invalid response from bookmark API";
                    return;
                }
                const contactId = updatedContact._id;
                const BookmarkedStatus = updatedContact.bookmarked;
                state.data = state.data.map(c =>
                    c._id === contactId ? { ...c, bookmarked: BookmarkedStatus } : c
                );
                state.error = null;
            })
            .addCase(toggleBookmarkContact.rejected, (state, action) => {
                state.error = action.payload || 'Failed to toggle bookmark';
                console.error("toggleBookmarkContact.rejected - Error during bookmark toggle.");
            });
    },
});


export const { setPaginationParams } = contactSlice.actions;
export default contactSlice.reducer;