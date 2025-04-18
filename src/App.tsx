import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";

import { AuthProvider } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import StudentsPage from "./pages/admin/StudentsPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GradeManagement from "./pages/teacher/GradeManagement";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loader"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />; // Show loader instead of null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Navigate to="/signup" replace />} />
                
                {/* Dashboard redirect */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Protected routes */}
                <Route element={<MainLayout />}>
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/teachers" element={<ManageUsers />} />
                  <Route path="/admin/students" element={<StudentsPage />} />
                  <Route path="/admin/parents" element={<ManageUsers />} />
                  <Route path="/admin/subjects" element={<SubjectsPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/settings" element={<SettingsPage />} />
                  
                  {/* Teacher routes */}
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/grades" element={<GradeManagement />} />
                  <Route path="/teacher/students" element={<ManageUsers />} />
                  <Route path="/teacher/feedback" element={<ManageUsers />} />
                  
                  {/* Parent routes - ensure these are correctly defined */}
                  <Route path="/parent" element={<ParentDashboard />} />
                  <Route path="/parent/grades" element={<ParentDashboard />} />
                  <Route path="/parent/feedback" element={<ParentDashboard />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
