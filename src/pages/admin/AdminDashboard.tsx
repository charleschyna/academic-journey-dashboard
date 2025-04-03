import { useState } from 'react';
import { Users, BookOpen, GraduationCap, BarChart3, User } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import DataCard from '@/components/ui-custom/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { mysqlClient } from '@/integrations/mysql/client';
import { toast } from 'sonner';

interface SystemStats {
  studentCount: number;
  teacherCount: number;
  parentCount: number;
  subjectCount: number;
}

interface PerformanceData {
  subject: string;
  average: number;
  change: number;
}

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useRequireAuth(['admin']);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch system stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      if (!user) return { studentCount: 0, teacherCount: 0, parentCount: 0, subjectCount: 0 };
      
      try {
        // For development if API is not connected
        if (process.env.NODE_ENV === 'development') {
          // Return mock data
          return {
            studentCount: 120,
            teacherCount: 15,
            parentCount: 95,
            subjectCount: 8
          };
        }
        
        // In production, fetch from API
        const stats = await mysqlClient.stats.getAdminStats();
        return stats;
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load dashboard statistics');
        return { studentCount: 0, teacherCount: 0, parentCount: 0, subjectCount: 0 };
      }
    },
    enabled: !!user,
  });
  
  // Fetch subject performance data
  const { data: performance, isLoading: performanceLoading } = useQuery({
    queryKey: ['admin-performance'],
    queryFn: async () => {
      try {
        // For development if API is not connected
        if (process.env.NODE_ENV === 'development') {
          // Return mock data
          return [
            { subject: 'Mathematics', average: 68, change: 2.5 },
            { subject: 'English', average: 72, change: -1.3 },
            { subject: 'Science', average: 65, change: 0.8 },
            { subject: 'History', average: 78, change: 3.2 },
          ];
        }
        
        // Get all subjects
        const subjects = await mysqlClient.subjects.getAll();
        
        // In a real implementation, we would fetch performance data from the API
        // For now, we'll create mock data based on subject names
        const subjectPerformance: PerformanceData[] = subjects.map((subject) => {
          // Generate random performance data
          const avg = Math.round(Math.random() * 30 + 60); // 60-90%
          const change = Math.round((Math.random() * 10 - 5) * 10) / 10; // -5 to +5 with one decimal
          
          return {
            subject: subject.name,
            average: avg,
            change: change
          };
        });
        
        return subjectPerformance;
      } catch (error) {
        console.error('Error fetching performance data:', error);
        toast.error('Failed to load performance data');
        return [];
      }
    },
    enabled: !!user,
  });
  
  const isLoading = authLoading || statsLoading || performanceLoading;
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const statCards = [
    {
      title: 'Total Students',
      value: stats?.studentCount.toString() || '0',
      icon: <Users className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Total Teachers',
      value: stats?.teacherCount.toString() || '0',
      icon: <GraduationCap className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Total Parents',
      value: stats?.parentCount.toString() || '0',
      icon: <User className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Subjects',
      value: stats?.subjectCount.toString() || '0',
      icon: <BookOpen className="h-5 w-5" />,
      change: 0,
    },
  ];
  
  // Group students by grade for the grade performance chart
  const gradePerformance = [
    { grade: 'Form 1', average: 72 },
    { grade: 'Form 2', average: 68 },
    { grade: 'Form 3', average: 75 },
    { grade: 'Form 4', average: 70 },
  ];
  
  return (
    <div className="page-container">
      <PageHeader 
        title={`Welcome, ${user.firstName}`}
        description="Here's what's happening in your school today"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <DataCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Average Performance by Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradePerformance.map((grade) => (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{grade.grade}</span>
                        <span className="text-sm font-medium">
                          {grade.average}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full"
                          style={{width: `${grade.average}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Students by Gender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-primary">52%</div>
                      <div className="text-sm mt-2 text-muted-foreground">Male Students</div>
                      <div className="text-2xl font-semibold mt-1">
                        {Math.round(stats?.studentCount * 0.52) || 0}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-highlight">48%</div>
                      <div className="text-sm mt-2 text-muted-foreground">Female Students</div>
                      <div className="text-2xl font-semibold mt-1">
                        {Math.round(stats?.studentCount * 0.48) || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Performance by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              {performance && performance.length > 0 ? (
                <div className="space-y-6">
                  {performance.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-sm font-medium">{item.subject}</div>
                          <div 
                            className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}% from last term
                          </div>
                        </div>
                        <div className="text-xl font-bold">{item.average}<span className="text-sm text-muted-foreground ml-1">%</span></div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div 
                          className={`h-2 rounded-full ${item.change >= 0 ? 'bg-primary' : 'bg-orange-500'}`}
                          style={{width: `${item.average}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No performance data available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => {
                  const activities = [
                    "New student registered",
                    "Grade report uploaded",
                    "Teacher added new subject",
                    "Parent viewed report",
                    "Fee payment recorded",
                    "Admin updated system settings"
                  ];
                  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                  return (
                    <li key={index} className="flex items-start gap-4 py-2">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{randomActivity}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 12) + 1} hour{Math.random() > 0.5 ? 's' : ''} ago
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
