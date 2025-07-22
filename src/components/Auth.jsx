
import  { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';

function AuthPage() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/phonebook');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <>
      <Routes>
        <Route path="signin" element={<SignIn/>} />
        <Route path="signup" element={<SignUp />} />

        <Route path="/" element={<Navigate to="signin" replace />} />
      </Routes>
    </>
  );
}

export default AuthPage;
