
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LoginCredentials, RegisterData } from '@/types';

// This is a mock authentication system
// Replace with Supabase or another auth provider when connected

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@school.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'teacher@school.com',
    role: 'teacher',
    firstName: 'Teacher',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'parent@school.com',
    role: 'parent',
    firstName: 'Parent',
    lastName: 'User',
    createdAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you would verify the password here
      
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (foundUser.role === 'admin') {
        navigate('/admin');
      } else if (foundUser.role === 'teacher') {
        navigate('/teacher');
      } else if (foundUser.role === 'parent') {
        navigate('/parent');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === data.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be done on the server)
      const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        email: data.email,
        role: data.role || 'parent', // Default to parent
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, you would hash the password and store the user in a database
      
      // For this mock version, we'll just set the user in state
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Account created successfully!');
      
      // Redirect based on role
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else if (newUser.role === 'teacher') {
        navigate('/teacher');
      } else if (newUser.role === 'parent') {
        navigate('/parent');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
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
      navigate('/login');
    } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
      toast.error("You don't have permission to access this page");
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'teacher') {
        navigate('/teacher');
      } else if (user.role === 'parent') {
        navigate('/parent');
      }
    }
  }, [user, isLoading, allowedRoles, navigate]);
  
  return { user, isLoading };
};
