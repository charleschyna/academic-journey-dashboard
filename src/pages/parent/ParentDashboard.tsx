
import { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import DataCard from '@/components/ui-custom/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Student, Grade } from '@/types';

interface GradeWithSubject extends Grade {
  subjects: {
    name: string;
    code: string;
  };
  teachers: {
    first_name: string;
    last_name: string;
  };
}

interface FeedbackWithDetails {
  id: string;
  content: string;
  date: string;
  teachers: {
    first_name: string;
    last_name: string;
  };
  subjects: {
    name: string;
  };
}

const ParentDashboard = () => {
  const { user, isLoading: authLoading } = useRequireAuth(['parent']);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  
  // Fetch children for parent
  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id);
        
      if (error) {
        toast.error('Error loading children data');
        console.error('Error fetching children:', error);
        return [];
      }
      
      return data as Student[];
    },
    enabled: !!user,
  });
  
  // Set first child as selected on initial load
  useEffect(() => {
    if (children && children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);
  
  // Fetch grades for selected child
  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ['grades', selectedChild],
    queryFn: async () => {
      if (!selectedChild) return [];
      
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          subjects:subject_id(*),
          teachers:teacher_id(first_name, last_name)
        `)
        .eq('student_id', selectedChild);
        
      if (error) {
        toast.error('Error loading grades data');
        console.error('Error fetching grades:', error);
        return [];
      }
      
      return data as GradeWithSubject[];
    },
    enabled: !!selectedChild,
  });
  
  // Fetch feedback for selected child
  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ['feedback', selectedChild],
    queryFn: async () => {
      if (!selectedChild) return [];
      
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          teachers:teacher_id(first_name, last_name),
          subjects:subject_id(name)
        `)
        .eq('student_id', selectedChild);
        
      if (error) {
        toast.error('Error loading feedback data');
        console.error('Error fetching feedback:', error);
        return [];
      }
      
      return data as FeedbackWithDetails[];
    },
    enabled: !!selectedChild,
  });
  
  // Calculate stats based on real data
  const calculateStats = () => {
    if (!grades || grades.length === 0) {
      return [
        {
          title: 'Average Grade',
          value: 'N/A',
          icon: <ClipboardCheck className="h-5 w-5" />,
        },
        {
          title: 'Subjects',
          value: '0',
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          title: 'Attendance',
          value: 'N/A',
          icon: <User className="h-5 w-5" />,
        },
        {
          title: 'Class Rank',
          value: 'N/A',
          icon: <GraduationCap className="h-5 w-5" />,
        }
      ];
    }
    
    // Calculate average score
    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = Math.round(totalScore / grades.length);
    
    // Count unique subjects
    const uniqueSubjects = new Set(grades.map(grade => grade.subjectId)).size;
    
    return [
      {
        title: 'Average Grade',
        value: `${averageScore}%`,
        icon: <ClipboardCheck className="h-5 w-5" />,
        change: 0, // We don't have historical data yet
      },
      {
        title: 'Subjects',
        value: uniqueSubjects.toString(),
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: 'Attendance',
        value: '96%', // Placeholder, until we have attendance data
        icon: <User className="h-5 w-5" />,
      },
      {
        title: 'Class Rank',
        value: 'N/A', // We don't have ranking data yet
        icon: <GraduationCap className="h-5 w-5" />,
      }
    ];
  };
  
  const isLoading = authLoading || childrenLoading;
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  // Handle no children case
  if (children && children.length === 0) {
    return (
      <div className="page-container">
        <PageHeader 
          title={`Welcome, ${user.firstName}`}
          description="Monitor your child's academic progress"
        />
        
        <Card className="my-8">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No students found</h2>
              <p className="text-muted-foreground mb-4">
                You don't have any students linked to your account yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact the school administration to add your children to your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const selectedChildData = children?.find(child => child.id === selectedChild);
  const childStats = calculateStats();
  
  // Format grades data for display
  const getGradeDisplay = (score: number) => {
    if (score >= 80) return { grade: 'A', color: 'text-green-600' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (score >= 60) return { grade: 'C', color: 'text-amber-600' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'E', color: 'text-red-600' };
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title={`Welcome, ${user.firstName}`}
        description="Monitor your child's academic progress"
      />
      
      <div className="mb-6 animate-fade-in">
        {selectedChildData && (
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {`${selectedChildData.firstName.charAt(0)}${selectedChildData.lastName.charAt(0)}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{`${selectedChildData.firstName} ${selectedChildData.lastName}`}</h2>
              <p className="text-muted-foreground">{`${selectedChildData.grade} ${selectedChildData.stream || ''}`}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {children?.map((child) => (
            <Button
              key={child.id}
              variant={child.id === selectedChild ? "default" : "outline"}
              onClick={() => setSelectedChild(child.id)}
              className="transition-all"
            >
              {`${child.firstName} ${child.lastName}`}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {childStats.map((stat, index) => (
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
      
      <Tabs defaultValue="grades" className="animate-slide-up">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="feedback">Teacher Feedback</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {gradesLoading ? (
                <div className="py-8 text-center">
                  <span className="loader"></span>
                </div>
              ) : grades && grades.length > 0 ? (
                <div className="space-y-6">
                  {grades.map((grade, index) => {
                    const { grade: letterGrade, color } = getGradeDisplay(grade.score);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{grade.subjects?.name || 'Unknown Subject'}</span>
                              <span className={`ml-2 font-bold ${color}`}>
                                {letterGrade}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Teacher: {grade.teachers ? `${grade.teachers.first_name} ${grade.teachers.last_name}` : 'Unknown'}
                            </div>
                          </div>
                          <div className="text-xl font-bold">{grade.score}<span className="text-sm text-muted-foreground ml-1">%</span></div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              grade.score >= 80 ? 'bg-green-500' :
                              grade.score >= 70 ? 'bg-primary' :
                              grade.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{width: `${grade.score}%`}}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No grades available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Teacher Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackLoading ? (
                <div className="py-8 text-center">
                  <span className="loader"></span>
                </div>
              ) : feedback && feedback.length > 0 ? (
                <div className="space-y-6">
                  {feedback.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium">
                            {item.teachers ? `${item.teachers.first_name} ${item.teachers.last_name}` : 'Unknown Teacher'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.subjects?.name || 'Unknown Subject'}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm">"{item.content}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No feedback available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Attendance tracking will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
