import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from './index';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }
  
  // Render the admin layout with the children if user is an admin
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminRoute; 