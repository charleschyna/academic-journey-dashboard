import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LoginCredentials, RegisterData } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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

  // Check active session and set user
  useEffect(() => {
    try {
      // For development without Supabase credentials
      if (!supabase) {
        console.warn("Supabase credentials missing. Using mock auth.");
        // Set a mock user for development
        const mockUser: User = {
          id: "mock-user-id",
          email: "test@example.com",
          role: "admin",
          firstName: "Test",
          lastName: "User",
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
        return;
      }
      
      // Check if user is stored in localStorage as a fallback
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
      
      // Set up Supabase auth subscription
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            // Get the user profile from the profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profile) {
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                role: profile.role || 'parent',
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                createdAt: profile.created_at || new Date().toISOString(),
              };
              
              setUser(userData);
              try {
                localStorage.setItem('user', JSON.stringify(userData));
              } catch (error) {
                console.error("Failed to store user in localStorage:", error);
              }
            }
          } else {
            setUser(null);
            try {
              localStorage.removeItem('user');
            } catch (error) {
              console.error("Failed to remove user from localStorage:", error);
            }
          }
          setIsLoading(false);
        }
      );
      
      // Check current session on load
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
        }
      };
      
      checkSession();
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        // Mock login for development - Use the specified role instead of always parent
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Get user profile from the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          toast.success('Logged in successfully!');
          
          // Redirect based on role - explicitly set paths
          if (profile.role === 'admin') {
            navigate('/admin');
          } else if (profile.role === 'teacher') {
            navigate('/teacher');
          } else if (profile.role === 'parent') {
            navigate('/parent');
          } else {
            // Default fallback - shouldn't happen with proper validation
            console.warn("Unknown role, defaulting to parent view");
            navigate('/parent');
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        // Mock registration for development - make sure to use the specified role
        const mockUser: User = {
          id: "mock-user-id",
          email: data.email,
          role: data.role || 'parent',
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // If registering as a parent, create a mock student
        if (data.role === 'parent' && data.childDetails) {
          console.log('Creating mock student:', data.childDetails);
          // In a real implementation, this would save to Supabase
        }
        
        toast.success('Account created successfully (Dev Mode)!');
        navigate('/login');
        return;
      }
      
      // Register user with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      if (authData.user) {
        // Insert user profile into profiles table - ensure role is saved correctly
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              role: data.role || 'parent',
              email: data.email,
            }
          ]);
          
        if (profileError) throw profileError;
        
        // If registering as a parent, create a student record and link it
        if (data.role === 'parent' && data.childDetails) {
          // Create student record with proper parent_id link
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .insert([
              {
                first_name: data.childDetails.firstName,
                last_name: data.childDetails.lastName,
                admission_number: data.childDetails.admissionNumber,
                date_of_birth: data.childDetails.dateOfBirth,
                grade: data.childDetails.grade || 'Unknown',
                parent_id: authData.user.id // Link student to parent
              }
            ])
            .select();
          
          if (studentError) throw studentError;
          
          // This parent-student linking was incorrectly using separate table; now using parent_id on student
          console.log("Created student with parent link:", studentData);
        }
        
        toast.success('Account created successfully! Check your email for verification.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      setUser(null);
      try {
        localStorage.removeItem('user');
      } catch (error) {
        console.error("Failed to remove user from localStorage:", error);
      }
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
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
