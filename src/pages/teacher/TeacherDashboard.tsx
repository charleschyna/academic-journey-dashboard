
import { useState, useEffect } from 'react';
import { Users, BookOpen, LineChart, Calendar } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import DataCard from '@/components/ui-custom/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeacherStats {
  studentCount: number;
  classCount: number;
  averageScore: number;
}

interface GradeWithDetails {
  id: string;
  score: number;
  term: string;
  year: number;
  created_at: string;
  students: {
    id: string;
    first_name: string;
    last_name: string;
    grade: string;
  };
  subjects: {
    id: string;
    name: string;
    code: string;
  };
}

interface ClassSchedule {
  name: string;
  time: string;
  day: string;
}

const TeacherDashboard = () => {
  const { user, isLoading: authLoading } = useRequireAuth(['teacher']);
  
  // Fetch teacher stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['teacher-stats', user?.id],
    queryFn: async () => {
      if (!user) return { studentCount: 0, classCount: 0, averageScore: 0 };
      
      // Get grades entered by this teacher to calculate stats
      const { data: grades, error } = await supabase
        .from('grades')
        .select(`
          id,
          score,
          student_id,
          subject_id
        `)
        .eq('teacher_id', user.id);
        
      if (error) {
        toast.error('Error loading teacher stats');
        console.error('Error fetching teacher stats:', error);
        return { studentCount: 0, classCount: 0, averageScore: 0 };
      }
      
      // Calculate stats
      const uniqueStudents = new Set(grades?.map(g => g.student_id) || []);
      const uniqueSubjects = new Set(grades?.map(g => g.subject_id) || []);
      const totalScore = grades?.reduce((sum, grade) => sum + grade.score, 0) || 0;
      const averageScore = grades && grades.length > 0 ? Math.round(totalScore / grades.length) : 0;
      
      return {
        studentCount: uniqueStudents.size,
        classCount: uniqueSubjects.size,
        averageScore: averageScore
      };
    },
    enabled: !!user,
  });
  
  // Fetch recent grades
  const { data: recentGrades, isLoading: gradesLoading } = useQuery({
    queryKey: ['teacher-recent-grades', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students:student_id(*),
          subjects:subject_id(*)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) {
        toast.error('Error loading recent grades');
        console.error('Error fetching recent grades:', error);
        return [];
      }
      
      return data as GradeWithDetails[];
    },
    enabled: !!user,
  });
  
  // In a real app, this would be fetched from a schedule table
  // For now, we'll use sample data
  const upcomingClasses: ClassSchedule[] = [
    { name: 'Form 3A Mathematics', time: '08:00 - 09:30', day: 'Monday' },
    { name: 'Form 2B Mathematics', time: '10:00 - 11:30', day: 'Monday' },
    { name: 'Form 4A Mathematics', time: '08:00 - 09:30', day: 'Tuesday' },
    { name: 'Form 1C Mathematics', time: '10:00 - 11:30', day: 'Tuesday' },
  ];
  
  const isLoading = authLoading || statsLoading || gradesLoading;
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const statCards = [
    {
      title: 'My Students',
      value: stats?.studentCount.toString() || '0',
      icon: <Users className="h-5 w-5" />,
      change: 0, // We don't have historical data yet
    },
    {
      title: 'Classes Taught',
      value: stats?.classCount.toString() || '0',
      icon: <BookOpen className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Average Performance',
      value: `${stats?.averageScore || 0}%`,
      icon: <LineChart className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Next Assessment',
      value: 'Coming Soon',
      icon: <Calendar className="h-5 w-5" />,
    },
  ];
  
  // Group grades by class for performance overview
  const classPerformance = recentGrades?.reduce((acc, grade) => {
    const classKey = grade.students.grade || 'Unknown';
    if (!acc[classKey]) {
      acc[classKey] = { total: 0, count: 0 };
    }
    acc[classKey].total += grade.score;
    acc[classKey].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);
  
  return (
    <div className="page-container">
      <PageHeader 
        title={`Welcome, ${user.firstName}`}
        description="Here's an overview of your classes and student performance"
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Assessments</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            {recentGrades && recentGrades.length > 0 ? (
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <div>
                      <h4 className="font-medium">
                        {grade.students?.grade || 'Unknown'} - {grade.subjects?.name || 'Unknown Subject'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(grade.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`h-2 w-2 rounded-full ${
                            grade.score >= 70 ? 'bg-green-500' :
                            grade.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="font-semibold">{grade.score}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Student Score</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No recent assessments found.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Classes</CardTitle>
            <Button variant="outline" size="sm">Full Schedule</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <div>
                    <h4 className="font-medium">{cls.name}</h4>
                    <p className="text-sm text-muted-foreground">{cls.day}, {cls.time}</p>
                  </div>
                  <Button size="sm" variant="outline">Prepare</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Class Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {classPerformance && Object.keys(classPerformance).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(classPerformance).map(([className, data]) => {
                const averageScore = Math.round(data.total / data.count);
                return (
                  <div key={className} className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{className}</span>
                        <span className="text-sm text-muted-foreground ml-2">Average</span>
                      </div>
                      <span className="font-medium">
                        {averageScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{width: `${averageScore}%`}}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No class performance data available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
