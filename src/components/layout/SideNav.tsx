
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  BookOpen,
  GraduationCap,
  Home,
  LogOut, 
  Users,
  BarChart3,
  Settings,
  User,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const SideNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { to: '/admin/teachers', label: 'Teachers', icon: <GraduationCap className="w-5 h-5" /> },
    { to: '/admin/students', label: 'Students', icon: <Users className="w-5 h-5" /> },
    { to: '/admin/parents', label: 'Parents', icon: <User className="w-5 h-5" /> },
    { to: '/admin/subjects', label: 'Subjects', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/admin/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const teacherLinks = [
    { to: '/teacher', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { to: '/teacher/grades', label: 'Manage Grades', icon: <FileText className="w-5 h-5" /> },
    { to: '/teacher/students', label: 'My Students', icon: <Users className="w-5 h-5" /> },
    { to: '/teacher/feedback', label: 'Send Feedback', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const parentLinks = [
    { to: '/parent', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { to: '/parent/grades', label: 'Grades', icon: <FileText className="w-5 h-5" /> },
    { to: '/parent/feedback', label: 'Feedback', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  let links;
  if (user.role === 'admin') {
    links = adminLinks;
  } else if (user.role === 'teacher') {
    links = teacherLinks;
  } else {
    links = parentLinks;
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="font-semibold text-lg tracking-tight">SPTS</div>
        </div>
        <SidebarTrigger className="hidden lg:flex" />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent
                ${isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'}`
              }
              end={link.to.split('/').length === 2}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.firstName)}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/70 capitalize truncate">
              {user.role}
            </p>
          </div>
        </div>
        <Button
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
