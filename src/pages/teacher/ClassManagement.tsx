
import { useState } from 'react';
import { Search, Users, BookOpen, FileText, MessageSquare, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data
const mockClasses = [
  { 
    id: '1', 
    name: 'Form 3A', 
    subject: 'Mathematics', 
    students: 28, 
    avgScore: 72,
    lastClass: '2023-06-20T09:30:00Z',
    nextClass: '2023-06-22T09:30:00Z',
    topicsCovered: ['Quadratic Equations', 'Polynomials', 'Functions'],
    upcomingTopics: ['Trigonometry', 'Vectors']
  },
  { 
    id: '2', 
    name: 'Form 2B', 
    subject: 'Mathematics', 
    students: 32, 
    avgScore: 68,
    lastClass: '2023-06-20T11:30:00Z',
    nextClass: '2023-06-22T11:30:00Z',
    topicsCovered: ['Linear Equations', 'Geometry', 'Basic Algebra'],
    upcomingTopics: ['Quadratic Equations', 'Statistics']
  },
  { 
    id: '3', 
    name: 'Form 4A', 
    subject: 'Mathematics', 
    students: 25, 
    avgScore: 76,
    lastClass: '2023-06-21T08:30:00Z',
    nextClass: '2023-06-23T08:30:00Z',
    topicsCovered: ['Calculus Basics', 'Sequences and Series', 'Probability'],
    upcomingTopics: ['Advanced Calculus', 'Complex Numbers']
  },
  { 
    id: '4', 
    name: 'Form 1C', 
    subject: 'Mathematics', 
    students: 35, 
    avgScore: 65,
    lastClass: '2023-06-21T13:30:00Z',
    nextClass: '2023-06-23T13:30:00Z',
    topicsCovered: ['Number Systems', 'Basic Algebra', 'Geometry Basics'],
    upcomingTopics: ['Linear Equations', 'Basic Statistics']
  },
];

const mockStudents = [
  { id: '1', name: 'Alex Maina', class: 'Form 3A', admissionNumber: 'ADM001', performance: 82 },
  { id: '2', name: 'Beatrice Wanjiku', class: 'Form 3A', admissionNumber: 'ADM002', performance: 75 },
  { id: '3', name: 'Charles Omondi', class: 'Form 3A', admissionNumber: 'ADM003', performance: 91 },
  { id: '4', name: 'Diana Kerubo', class: 'Form 3A', admissionNumber: 'ADM004', performance: 68 },
  { id: '5', name: 'Edwin Kamau', class: 'Form 2B', admissionNumber: 'ADM005', performance: 72 },
  { id: '6', name: 'Faith Njeri', class: 'Form 2B', admissionNumber: 'ADM006', performance: 88 },
  { id: '7', name: 'George Wafula', class: 'Form 2B', admissionNumber: 'ADM007', performance: 65 },
  { id: '8', name: 'Hannah Achieng', class: 'Form 2B', admissionNumber: 'ADM008', performance: 79 },
];

const mockLessonPlans = [
  { id: '1', class: 'Form 3A', subject: 'Mathematics', topic: 'Trigonometry', date: '2023-06-22T09:30:00Z', status: 'upcoming' },
  { id: '2', class: 'Form 2B', subject: 'Mathematics', topic: 'Quadratic Equations', date: '2023-06-22T11:30:00Z', status: 'upcoming' },
  { id: '3', class: 'Form 3A', subject: 'Mathematics', topic: 'Polynomials', date: '2023-06-20T09:30:00Z', status: 'completed' },
  { id: '4', class: 'Form 2B', subject: 'Mathematics', topic: 'Geometry', date: '2023-06-20T11:30:00Z', status: 'completed' },
];

const ClassManagement = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false);
  const [selectedClassData, setSelectedClassData] = useState<(typeof mockClasses)[0] | null>(null);
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const filteredClasses = selectedClass
    ? mockClasses.filter(c => c.name === selectedClass)
    : mockClasses;
    
  const filteredStudents = selectedClass
    ? mockStudents.filter(s => s.class === selectedClass)
    : mockStudents;
    
  const filteredLessonPlans = selectedClass
    ? mockLessonPlans.filter(l => l.class === selectedClass)
    : mockLessonPlans;
  
  const handleOpenClassDetails = (classData: (typeof mockClasses)[0]) => {
    setSelectedClassData(classData);
    setIsClassDetailsOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge className="bg-red-500">Needs Improvement</Badge>;
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Class Management"
        description="Manage your classes, subjects, and student lists"
      />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes or students..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="classes">
        <TabsList className="w-full md:w-auto grid grid-cols-3 mb-6">
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{cls.name}</span>
                    <Badge>{cls.subject}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {cls.students} students | Avg. Score: {cls.avgScore}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Class:</span>
                      <span>{formatDate(cls.lastClass)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Class:</span>
                      <span>{formatDate(cls.nextClass)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => handleOpenClassDetails(cls)}
                  >
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{selectedClass ? `Students in ${selectedClass}` : 'All Students'}</CardTitle>
              <CardDescription>
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Admission Number</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.admissionNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{student.performance}%</span>
                            {getPerformanceBadge(student.performance)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4 mr-1" />
                              Grades
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Feedback
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lessons" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plans</CardTitle>
              <CardDescription>
                Recent and upcoming lesson plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Upcoming Lessons</h3>
                  <div className="space-y-2">
                    {filteredLessonPlans
                      .filter(plan => plan.status === 'upcoming')
                      .map((plan) => (
                        <div key={plan.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">{plan.class} - {plan.topic}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(plan.date)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                              View Plan
                            </Button>
                            <Button size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Past Lessons</h3>
                  <div className="space-y-2">
                    {filteredLessonPlans
                      .filter(plan => plan.status === 'completed')
                      .map((plan) => (
                        <div key={plan.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">{plan.class} - {plan.topic}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(plan.date)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                              View Notes
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <Button variant="outline">View All Plans</Button>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Lesson Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Class Details Dialog */}
      <Dialog open={isClassDetailsOpen} onOpenChange={setIsClassDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
            <DialogDescription>
              {selectedClassData && `${selectedClassData.name} - ${selectedClassData.subject}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClassData && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Students</Label>
                  <div className="text-2xl font-bold">{selectedClassData.students}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Average Score</Label>
                  <div className="text-2xl font-bold">{selectedClassData.avgScore}%</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Last Class</Label>
                  <div>{formatDate(selectedClassData.lastClass)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Next Class</Label>
                  <div>{formatDate(selectedClassData.nextClass)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Topics Covered</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClassData.topicsCovered.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Upcoming Topics</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClassData.upcomingTopics.map((topic, index) => (
                      <Badge key={index} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button onClick={() => {
                  setIsClassDetailsOpen(false);
                  setSelectedClass(selectedClassData.name);
                  const tabsList = document.querySelector('[role="tablist"]');
                  const studentsTab = tabsList?.querySelector('[value="students"]');
                  if (studentsTab) {
                    (studentsTab as HTMLElement).click();
                  }
                }}>
                  <Users className="h-4 w-4 mr-1" />
                  View Students
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Lesson Plans
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassManagement;
