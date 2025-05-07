import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import Cookies from 'js-cookie';

const PrivateRoute = () => {
  const { isAuthenticated, loadingData } = useAuth();
  // const token = Cookies.get('token');
  // Optionally you can show a loading indicator while auth state is loading
  if (loadingData) {
    return <div>Loading...</div>; // or a spinner component
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
