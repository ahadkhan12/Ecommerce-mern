import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader size="large" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
