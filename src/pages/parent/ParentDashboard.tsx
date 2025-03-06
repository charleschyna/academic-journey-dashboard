
import { useState } from 'react';
import { User, BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import DataCard from '@/components/ui-custom/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const ParentDashboard = () => {
  const { user, isLoading } = useRequireAuth(['parent']);
  const [selectedChild, setSelectedChild] = useState(0);
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  // Mock child data
  const children = [
    {
      id: 1,
      name: 'James Mwangi',
      grade: 'Form 3A',
      photo: '',
      stats: [
        {
          title: 'Average Grade',
          value: '75%',
          icon: <ClipboardCheck className="h-5 w-5" />,
          change: 2.5,
        },
        {
          title: 'Attendance',
          value: '96%',
          icon: <User className="h-5 w-5" />,
          change: 1.2,
        },
        {
          title: 'Subjects',
          value: '8',
          icon: <BookOpen className="h-5 w-5" />,
          change: 0,
        },
        {
          title: 'Class Rank',
          value: '7/45',
          icon: <GraduationCap className="h-5 w-5" />,
          change: 4,
        }
      ],
      subjects: [
        { name: 'Mathematics', grade: 'B+', percentage: 78, teacher: 'Mr. Otieno' },
        { name: 'English', grade: 'A-', percentage: 82, teacher: 'Mrs. Kamau' },
        { name: 'Kiswahili', grade: 'B', percentage: 72, teacher: 'Mr. Wekesa' },
        { name: 'Biology', grade: 'A', percentage: 85, teacher: 'Mrs. Oloo' },
        { name: 'Chemistry', grade: 'B+', percentage: 77, teacher: 'Mr. Gitonga' },
        { name: 'Physics', grade: 'B', percentage: 70, teacher: 'Mrs. Njeri' },
        { name: 'History', grade: 'A-', percentage: 81, teacher: 'Mr. Omar' },
        { name: 'Geography', grade: 'B+', percentage: 75, teacher: 'Mrs. Wambui' },
      ],
      feedback: [
        { 
          teacher: 'Mr. Otieno', 
          subject: 'Mathematics', 
          date: 'June 3, 2023', 
          message: 'James has shown significant improvement in calculus this term. Keep encouraging him to practice regularly.'
        },
        { 
          teacher: 'Mrs. Kamau', 
          subject: 'English', 
          date: 'May 28, 2023', 
          message: 'James writes excellent essays, but needs to work on his grammar and punctuation.'
        },
        { 
          teacher: 'Mr. Gitonga', 
          subject: 'Chemistry', 
          date: 'May 15, 2023', 
          message: 'James performs well in practical experiments but needs to improve his theoretical knowledge.'
        },
      ]
    },
    {
      id: 2,
      name: 'Lucy Mwangi',
      grade: 'Form 1B',
      photo: '',
      stats: [
        {
          title: 'Average Grade',
          value: '82%',
          icon: <ClipboardCheck className="h-5 w-5" />,
          change: 5.2,
        },
        {
          title: 'Attendance',
          value: '98%',
          icon: <User className="h-5 w-5" />,
          change: 0.7,
        },
        {
          title: 'Subjects',
          value: '8',
          icon: <BookOpen className="h-5 w-5" />,
          change: 0,
        },
        {
          title: 'Class Rank',
          value: '3/48',
          icon: <GraduationCap className="h-5 w-5" />,
          change: 1,
        }
      ],
      subjects: [
        { name: 'Mathematics', grade: 'A', percentage: 86, teacher: 'Mrs. Moraa' },
        { name: 'English', grade: 'A', percentage: 88, teacher: 'Mr. Kamau' },
        { name: 'Kiswahili', grade: 'A-', percentage: 81, teacher: 'Mrs. Achieng' },
        { name: 'Biology', grade: 'B+', percentage: 78, teacher: 'Mr. Maina' },
        { name: 'Chemistry', grade: 'A-', percentage: 82, teacher: 'Mrs. Omondi' },
        { name: 'Physics', grade: 'B+', percentage: 77, teacher: 'Mr. Mwangi' },
        { name: 'History', grade: 'A', percentage: 85, teacher: 'Mrs. Njau' },
        { name: 'Geography', grade: 'A-', percentage: 80, teacher: 'Mr. Ochieng' },
      ],
      feedback: [
        { 
          teacher: 'Mrs. Moraa', 
          subject: 'Mathematics', 
          date: 'June 5, 2023', 
          message: 'Lucy demonstrates exceptional skills in algebra and is always helping her classmates.'
        },
        { 
          teacher: 'Mr. Kamau', 
          subject: 'English', 
          date: 'May 30, 2023', 
          message: 'Lucy is an excellent student. Her creative writing skills are particularly impressive.'
        },
        { 
          teacher: 'Mrs. Njau', 
          subject: 'History', 
          date: 'May 22, 2023', 
          message: 'Lucy shows a deep interest in historical events and contributes well to class discussions.'
        },
      ]
    }
  ];
  
  const childData = children[selectedChild];
  
  const getGradeColor = (grade: string) => {
    const firstChar = grade.charAt(0);
    if (firstChar === 'A') return 'text-green-600';
    if (firstChar === 'B') return 'text-blue-600';
    if (firstChar === 'C') return 'text-amber-600';
    if (firstChar === 'D') return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title={`Welcome, ${user.firstName}`}
        description="Monitor your child's academic progress"
      />
      
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {childData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{childData.name}</h2>
            <p className="text-muted-foreground">{childData.grade}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {children.map((child, index) => (
            <Button
              key={child.id}
              variant={index === selectedChild ? "default" : "outline"}
              onClick={() => setSelectedChild(index)}
              className="transition-all"
            >
              {child.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {childData.stats.map((stat, index) => (
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
              <div className="space-y-6">
                {childData.subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{subject.name}</span>
                          <span className={`ml-2 font-bold ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Teacher: {subject.teacher}
                        </div>
                      </div>
                      <div className="text-xl font-bold">{subject.percentage}<span className="text-sm text-muted-foreground ml-1">%</span></div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.percentage >= 80 ? 'bg-green-500' :
                          subject.percentage >= 70 ? 'bg-primary' :
                          subject.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{width: `${subject.percentage}%`}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Teacher Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {childData.feedback.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{item.teacher}</h4>
                        <p className="text-sm text-muted-foreground">{item.subject}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                    <p className="text-sm">"{item.message}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center my-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">
                    {childData.stats[1].value}
                  </div>
                  <p className="text-muted-foreground mt-2">Overall Attendance Rate</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="font-medium">Recent Absences</h3>
                {childData.id === 1 ? (
                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800">
                    <p className="font-medium">May 12, 2023</p>
                    <p className="text-sm">Reason: Medical appointment</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-muted-foreground">No absences in the last 60 days.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
