import React from 'react';
import { Navigate } from 'react-router-dom'; // Removed Outlet
import { useAuth } from '../context/AuthContext';
// Remove AdminLayout import as it's no longer used here

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth(); // Removed loading

  // Removed loading check
  // if (loading) {
  //   // Optional: Add a loading indicator while checking auth
  //   return <div>Loading...</div>;
  // }

  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    // Redirect non-admin users
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the children directly
  // The AdminLayout is applied in App.tsx
  return <>{children}</>; 
};

export default AdminRoute;