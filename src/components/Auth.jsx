
// import { Routes, Route, Navigate } from 'react-router-dom';
// import SignIn from './SignIn'; 
// import SignUp from './SignUp'; 


// const AuthPage = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="signin"/>} />
//       <Route path="signin" element={<SignIn />} />
//       <Route path="signup" element={<SignUp />} />
//     </Routes>
//   );
// };

// export default AuthPage;

// src/components/Auth.jsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'; // Make sure useSelector is imported
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';

function AuthPage() {
    const { isAuthenticated, loading } = useSelector((state) => state.auth); // Get isAuthenticated and loading
    const navigate = useNavigate();

    // THIS useEffect is CRUCIAL for redirecting AFTER successful login/signup
    useEffect(() => {
        // If the user becomes authenticated AND the initial session/auth loading is complete,
        // navigate them to the phonebook app.
        if (isAuthenticated && !loading) {
            console.log("Auth.jsx: isAuthenticated is true and not loading. Navigating to /phonebook"); // Add this log
            navigate('/phonebook', { replace: true }); // Use replace to prevent going back to login via back button
        }
    }, [isAuthenticated, loading, navigate]); // Dependencies: reruns when these change

    return (
      <>
            {/* You might want a small loading indicator or message here if auth.loading is true for the forms */}
            <Routes>
                <Route path="signin" element={<SignIn/>} />
                <Route path="signup" element={<SignUp />} />
                {/* Default redirect if /auth is accessed directly */}
                <Route path="/" element={<Navigate to="signin" replace />} />
            </Routes>
        </>
    );
}

export default AuthPage;
