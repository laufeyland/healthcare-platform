import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;