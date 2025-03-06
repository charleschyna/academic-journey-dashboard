
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/lib/auth";
import MainLayout from "@/components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GradeManagement from "./pages/teacher/GradeManagement";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard redirect */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Protected routes */}
            <Route element={<MainLayout />}>
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/teachers" element={<ManageUsers />} />
              <Route path="/admin/students" element={<ManageUsers />} />
              <Route path="/admin/parents" element={<ManageUsers />} />
              <Route path="/admin/subjects" element={<ManageUsers />} />
              <Route path="/admin/reports" element={<ManageUsers />} />
              <Route path="/admin/settings" element={<ManageUsers />} />
              
              {/* Teacher routes */}
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/grades" element={<GradeManagement />} />
              <Route path="/teacher/students" element={<ManageUsers />} />
              <Route path="/teacher/feedback" element={<ManageUsers />} />
              
              {/* Parent routes */}
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/grades" element={<ParentDashboard />} />
              <Route path="/parent/feedback" element={<ParentDashboard />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
