import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LoginCredentials, RegisterData } from '@/types';
import axios from 'axios';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        try {
          // Get user profile from API
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to check authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // For development without API connection
      if (process.env.NODE_ENV === 'development' && !API_URL) {
        // Mock login for development - Use the specified role based on email
        const mockUser: User = {
          id: "mock-user-id",
          email: credentials.email,
          role: credentials.email.includes('teacher') ? 'teacher' : 
                credentials.email.includes('admin') ? 'admin' : 'parent',
          firstName: "Test",
          lastName: "User",
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-token');
        toast.success('Logged in successfully (Dev Mode)!');
        
        // Redirect based on role
        if (mockUser.role === 'admin') {
          navigate('/admin');
        } else if (mockUser.role === 'teacher') {
          navigate('/teacher');
        } else {
          navigate('/parent');
        }
        return;
      }
      
      // Real login with API
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Save to state
        setUser(user);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success('Logged in successfully!');
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'teacher') {
          navigate('/teacher');
        } else if (user.role === 'parent') {
          navigate('/parent');
        } else {
          // Default fallback - shouldn't happen with proper validation
          console.warn("Unknown role, defaulting to parent view");
          navigate('/parent');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // For development without API connection
      if (process.env.NODE_ENV === 'development' && !API_URL) {
        // Mock registration for development
        const mockUser: User = {
          id: "mock-user-id",
          email: data.email,
          role: data.role || 'parent',
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: new Date().toISOString()
        };
        
        // If registering as a parent, create a mock student
        if (data.role === 'parent' && data.childDetails) {
          console.log('Creating mock student:', data.childDetails);
          // In a real implementation, this would save to database
        }
        
        toast.success('Account created successfully (Dev Mode)!');
        navigate('/login');
        return;
      }
      
      // Real registration with API
      const response = await api.post('/auth/register', data);
      
      if (response.data.success) {
        toast.success('Account created successfully! You can now log in.');
        navigate('/login');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth state
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for role-based access control
export const useRequireAuth = (allowedRoles: Array<'admin' | 'teacher' | 'parent'>) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Not authenticated, redirect to login
      navigate('/login');
    } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
      toast.error("You don't have permission to access this page");
      
      // Redirect based on role - ensure correct paths
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'teacher') {
        navigate('/teacher');
      } else if (user.role === 'parent') {
        navigate('/parent');
      } else {
        // Default fallback
        navigate('/login');
      }
    }
  }, [user, isLoading, allowedRoles, navigate]);
  
  return { user, isLoading };
};
