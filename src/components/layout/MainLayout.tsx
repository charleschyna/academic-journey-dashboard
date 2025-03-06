
import { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SideNav from '@/components/layout/SideNav';
import { useAuth } from '@/lib/auth';

const MainLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SideNav />
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="py-4 px-6 text-center text-muted-foreground">
            <p className="text-sm">
              Student Performance Tracking System &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
