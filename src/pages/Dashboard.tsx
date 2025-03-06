
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

// This is a helper component to redirect based on user role
const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If already on a specific dashboard, don't redirect
  if (location.pathname !== '/') {
    return null;
  }
  
  // Redirect based on user role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'teacher') {
    return <Navigate to="/teacher" replace />;
  } else if (user.role === 'parent') {
    return <Navigate to="/parent" replace />;
  }
  
  // Fallback - this should never happen with proper role validation
  console.warn("Unknown user role detected:", user.role);
  return <Navigate to="/login" />;
};

export default Dashboard;
