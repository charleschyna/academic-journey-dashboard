
import { useState } from 'react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, BarChart3, FileDown } from 'lucide-react';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from 'recharts';

// Mock data
const mockClasses = ['Form 3A', 'Form 2B', 'Form 4A', 'Form 1C'];
const mockSubjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];

// Performance data
const performanceData = [
  { name: 'Term 1', avg: 68, highest: 92, lowest: 45 },
  { name: 'Mid Term', avg: 72, highest: 94, lowest: 51 },
  { name: 'Term 2', avg: 74, highest: 96, lowest: 53 },
  { name: 'End Term', avg: 78, highest: 98, lowest: 58 },
];

// Grade distribution data
const gradeDistributionData = [
  { name: 'A', count: 5, color: '#22c55e' },
  { name: 'B', count: 12, color: '#3b82f6' },
  { name: 'C', count: 8, color: '#eab308' },
  { name: 'D', count: 3, color: '#ef4444' },
  { name: 'E', count: 1, color: '#9f1239' },
];

// Subject performance comparison
const subjectPerformanceData = [
  { name: 'Mathematics', score: 74 },
  { name: 'English', score: 68 },
  { name: 'Physics', score: 71 },
  { name: 'Chemistry', score: 65 },
  { name: 'Biology', score: 77 },
];

// Top performing students
const topStudentsData = [
  { id: '1', name: 'Charles Omondi', avg: 91, grades: { math: 92, eng: 89, phy: 94, chem: 90, bio: 90 } },
  { id: '2', name: 'Faith Njeri', avg: 88, grades: { math: 87, eng: 92, phy: 85, chem: 86, bio: 90 } },
  { id: '3', name: 'Hannah Achieng', avg: 85, grades: { math: 83, eng: 88, phy: 84, chem: 82, bio: 88 } },
  { id: '4', name: 'Alex Maina', avg: 82, grades: { math: 84, eng: 81, phy: 80, chem: 79, bio: 86 } },
  { id: '5', name: 'Beatrice Wanjiku', avg: 80, grades: { math: 78, eng: 85, phy: 76, chem: 77, bio: 84 } },
];

const ClassAnalytics = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  const [selectedClass, setSelectedClass] = useState<string>('Form 3A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 2');
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Class Analytics"
        description="View performance analytics and reports for your classes"
        action={{
          label: "Download Report",
          onClick: () => {/* Download functionality */},
          icon: <FileDown className="h-4 w-4" />,
        }}
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="students" className="hidden md:inline-flex">Top Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Average</CardTitle>
                <CardDescription>Current Average Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">74%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">↑ 4%</span> from previous term
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Highest Score</CardTitle>
                <CardDescription>Top Performance in Class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">96%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Charles Omondi
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lowest Score</CardTitle>
                <CardDescription>Needs Improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">53%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-red-500">↓ 2%</span> from previous term
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>{selectedClass} - {selectedSubject}</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Term Performance</CardTitle>
                <CardDescription>Average Score Trend</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avg" stroke="#8884d8" activeDot={{ r: 8 }} name="Average" />
                    <Line type="monotone" dataKey="highest" stroke="#82ca9d" name="Highest" />
                    <Line type="monotone" dataKey="lowest" stroke="#ff8042" name="Lowest" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Indicators</CardTitle>
              <CardDescription>{selectedClass} - {selectedSubject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={performanceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" name="Average" fill="#8884d8" />
                    <Bar dataKey="highest" name="Highest" fill="#82ca9d" />
                    <Bar dataKey="lowest" name="Lowest" fill="#ff8042" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Areas</CardTitle>
                <CardDescription>Performance by Topic</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Algebra</span>
                      <span>82%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Geometry</span>
                      <span>76%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calculus</span>
                      <span>68%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Probability</span>
                      <span>74%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Statistics</span>
                      <span>79%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '79%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
                <CardDescription>Topics Needing Focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-red-50 border border-red-100">
                    <div className="font-medium text-red-700">Calculus</div>
                    <div className="text-sm text-red-600 mt-1">
                      Class average is 68%. Suggest additional practice with differentiation and integration.
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-md bg-amber-50 border border-amber-100">
                    <div className="font-medium text-amber-700">Geometry</div>
                    <div className="text-sm text-amber-600 mt-1">
                      Class average is 76%. Review coordinate geometry concepts and provide more examples.
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-md bg-green-50 border border-green-100">
                    <div className="font-medium text-green-700">Algebra</div>
                    <div className="text-sm text-green-600 mt-1">
                      Class is performing well with 82% average. Continue with current approach.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Comparison</CardTitle>
              <CardDescription>Performance Across Subjects</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={subjectPerformanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Average Score" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Comparison</CardTitle>
                <CardDescription>Performance Across Classes - {selectedSubject}</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Form 3A', score: 74 },
                      { name: 'Form 2B', score: 68 },
                      { name: 'Form 4A', score: 76 },
                      { name: 'Form 1C', score: 65 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" name="Average Score" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Year-to-Year Comparison</CardTitle>
                <CardDescription>{selectedClass} - Performance Trend</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={[
                      { year: '2021', score: 62 },
                      { year: '2022', score: 69 },
                      { year: '2023', score: 74 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Average Score" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>{selectedClass} - {selectedSubject}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Mathematics</TableHead>
                    <TableHead className="text-center">English</TableHead>
                    <TableHead className="text-center">Physics</TableHead>
                    <TableHead className="text-center">Chemistry</TableHead>
                    <TableHead className="text-center">Biology</TableHead>
                    <TableHead className="text-right">Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudentsData.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-center">{student.grades.math}%</TableCell>
                      <TableCell className="text-center">{student.grades.eng}%</TableCell>
                      <TableCell className="text-center">{student.grades.phy}%</TableCell>
                      <TableCell className="text-center">{student.grades.chem}%</TableCell>
                      <TableCell className="text-center">{student.grades.bio}%</TableCell>
                      <TableCell className="text-right font-bold">{student.avg}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button variant="outline" className="mt-4 w-full">
                View All Students
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Students Needing Support</CardTitle>
              <CardDescription>Students with Average Below 60%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md border border-muted flex justify-between items-center">
                  <div>
                    <div className="font-medium">George Wafula</div>
                    <div className="text-sm text-muted-foreground">Average: 58% | Form 2B</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Send Feedback</Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border border-muted flex justify-between items-center">
                  <div>
                    <div className="font-medium">Jane Njoroge</div>
                    <div className="text-sm text-muted-foreground">Average: 52% | Form 3A</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Send Feedback</Button>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border border-muted flex justify-between items-center">
                  <div>
                    <div className="font-medium">Peter Kimani</div>
                    <div className="text-sm text-muted-foreground">Average: 55% | Form 2B</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Send Feedback</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Recommended Actions</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Schedule one-on-one sessions with struggling students</li>
                  <li>Provide additional practice materials for difficult topics</li>
                  <li>Consider different teaching approaches for different learning styles</li>
                  <li>Communicate with parents about areas where support is needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassAnalytics;
