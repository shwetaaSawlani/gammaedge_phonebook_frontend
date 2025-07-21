
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// // Define a variable to hold the actual configured fetchWithAuth function
// // This will be assigned after the store is initialized.
// export let fetchWithAuth = async (url, options = {}) => {
//     console.warn("fetchWithAuth not yet initialized. Ensure initializeFetchWithAuth has been called.");
//     // Fallback: Use basic fetch if not initialized, but this means auth won't work.
//     return fetch(url, options);
// };


// /**
//  * Initializes the fetchWithAuth function with Redux dispatch and getState.
//  * This should be called once after the Redux store is created.
//  *
//  * @param {Function} dispatch - The Redux store's dispatch function.
//  * @param {Function} getState - The Redux store's getState function.
//  * @param {Function} refreshAuthTokenThunk - The specific thunk for refreshing access tokens (e.g., refreshAccessToken).
//  * @param {Function} logoutUserThunk - The specific thunk for logging out users (e.g., logoutUser).
//  */
// export const initializeFetchWithAuth = (dispatch, getState, refreshAuthTokenThunk, logoutUserThunk) => {

//      = async (url, options = {}) => {
//         try {
//             const response = await fetch(url, { ...options, credentials: 'include' });

//             if (response.status === 401 || response.status === 403) {
//                 const errorData = await response.json().catch(() => ({ message: response.statusText || 'Authentication error' }));

//                 if (options._retry) {
//                     console.error("fetchWithAuth: Retry failed with 401/403. Forcing logout.");
//                     dispatch(logoutUserThunk()); // Use the injected logout thunk
//                     throw new Error("Session expired. Please log in again.");
//                 }

//                 if (isRefreshing) {
//                     return new Promise((resolve, reject) => {
//                         failedQueue.push({ resolve, reject });
//                     })
//                     .then(() => fetch(url, { ...options, credentials: 'include' }))
//                     .catch(err => { throw err; });
//                 }

//                 isRefreshing = true;

//                 try {
//                     // Dispatch the refresh token thunk using the injected dispatch
//                     await dispatch(refreshAuthTokenThunk()).unwrap();

//                     isRefreshing = false;
//                     processQueue(null);

//                     return fetch(url, { ...options, credentials: 'include', _retry: true });

//                 } catch (refreshError) {
//                     isRefreshing = false;
//                     processQueue(new Error("Token refresh failed."));
//                     // The refreshAuthTokenThunk (e.g., refreshAccessToken) is responsible
//                     // for dispatching logoutUserThunk on its own failure.
//                     throw refreshError;
//                 }
//             }

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({ message: response.statusText || 'An error occurred' }));
//                 throw new Error(errorData.message || 'Something went wrong.');
//             }

//             return response;

//         } catch (error) {
//             console.error("fetchWithAuth global error:", error);
//             throw error;
//         }
//     };
// };