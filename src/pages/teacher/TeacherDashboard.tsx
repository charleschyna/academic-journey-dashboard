
import { useState } from 'react';
import { Users, BookOpen, LineChart, Calendar } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import DataCard from '@/components/ui-custom/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TeacherDashboard = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const stats = [
    {
      title: 'My Students',
      value: '143',
      icon: <Users className="h-5 w-5" />,
      change: 2.1,
    },
    {
      title: 'Classes Taught',
      value: '4',
      icon: <BookOpen className="h-5 w-5" />,
      change: 0,
    },
    {
      title: 'Average Performance',
      value: '73%',
      icon: <LineChart className="h-5 w-5" />,
      change: 4.3,
    },
    {
      title: 'Next Assessment',
      value: 'Jun 15',
      icon: <Calendar className="h-5 w-5" />,
    },
  ];
  
  const recentGrades = [
    { class: 'Form 3A', subject: 'Mathematics', date: 'Jun 2, 2023', averageScore: 68 },
    { class: 'Form 2B', subject: 'Mathematics', date: 'Jun 1, 2023', averageScore: 72 },
    { class: 'Form 4A', subject: 'Mathematics', date: 'May 29, 2023', averageScore: 65 },
    { class: 'Form 1C', subject: 'Mathematics', date: 'May 28, 2023', averageScore: 74 },
  ];
  
  const upcomingClasses = [
    { name: 'Form 3A Mathematics', time: '08:00 - 09:30', day: 'Monday' },
    { name: 'Form 2B Mathematics', time: '10:00 - 11:30', day: 'Monday' },
    { name: 'Form 4A Mathematics', time: '08:00 - 09:30', day: 'Tuesday' },
    { name: 'Form 1C Mathematics', time: '10:00 - 11:30', day: 'Tuesday' },
  ];
  
  return (
    <div className="page-container">
      <PageHeader 
        title={`Welcome, ${user.firstName}`}
        description="Here's an overview of your classes and student performance"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <div>
                    <h4 className="font-medium">{grade.class}</h4>
                    <p className="text-sm text-muted-foreground">{grade.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className={`h-2 w-2 rounded-full ${
                          grade.averageScore >= 70 ? 'bg-green-500' :
                          grade.averageScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-semibold">{grade.averageScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Class Average</p>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="space-y-6">
            {['Form 1C', 'Form 2B', 'Form 3A', 'Form 4A'].map((cls) => (
              <div key={cls} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{cls}</span>
                    <span className="text-sm text-muted-foreground ml-2">Mathematics</span>
                  </div>
                  <span className="font-medium">
                    {Math.floor(60 + Math.random() * 20)}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all duration-500"
                    style={{width: `${60 + Math.floor(Math.random() * 20)}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
