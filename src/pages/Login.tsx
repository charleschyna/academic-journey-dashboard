import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { LoginCredentials } from '@/types';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (mode === 'login') {
      // Ensure we're passing a complete LoginCredentials object
      const credentials: LoginCredentials = {
        email: values.email,
        password: values.password,
      };
      await login(credentials);
    } else {
      // In a real app, this would navigate to registration
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Student Performance Tracking</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <Card className="glass-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          {...field} 
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader-sm mr-2"></span>
                  ) : null}
                  Sign in
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div className="space-y-3 w-full">
              <div className="text-center">
                <span>Demo credentials:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    form.setValue('email', 'admin@school.com');
                    form.setValue('password', 'password123');
                  }}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    form.setValue('email', 'teacher@school.com');
                    form.setValue('password', 'password123');
                  }}
                >
                  Teacher
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    form.setValue('email', 'parent@school.com');
                    form.setValue('password', 'password123');
                  }}
                >
                  Parent
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </div>
    </div>
  );
};

export default Login;
