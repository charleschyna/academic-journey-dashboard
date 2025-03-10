
import { useState } from 'react';
import { useRequireAuth } from '@/lib/auth';
import { 
  BarChart3,
  FileText, 
  Download, 
  Filter,
  Calendar,
  GraduationCap,
  Users,
  BookOpen
} from 'lucide-react';
import PageHeader from '@/components/ui-custom/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ReportsPage = () => {
  const { user, isLoading } = useRequireAuth(['admin']);
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [term, setTerm] = useState('term1');
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  // Mock data for reports
  const performanceByGradeData = [
    { grade: 'Grade 1', average: 78 },
    { grade: 'Grade 2', average: 72 },
    { grade: 'Grade 3', average: 85 },
    { grade: 'Grade 4', average: 68 },
    { grade: 'Grade 5', average: 76 },
    { grade: 'Grade 6', average: 81 },
  ];
  
  const subjectPerformanceData = [
    { subject: 'Mathematics', average: 68 },
    { subject: 'English', average: 76 },
    { subject: 'Science', average: 73 },
    { subject: 'Social Studies', average: 82 },
    { subject: 'Art', average: 90 },
    { subject: 'Physical Education', average: 88 },
  ];
  
  const studentsByGradeData = [
    { name: 'Grade 1', value: 42 },
    { name: 'Grade 2', value: 38 },
    { name: 'Grade 3', value: 45 },
    { name: 'Grade 4', value: 40 },
    { name: 'Grade 5', value: 35 },
    { name: 'Grade 6', value: 30 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const downloadReport = (reportType: string) => {
    // In a real application, this would generate and download a PDF report
    console.log(`Downloading ${reportType} report`);
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Reports & Analytics"
        description="Generate and view reports on student performance and school statistics"
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 animate-fade-in">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Academic Year:</span>
          <Select
            value={academicYear}
            onValueChange={setAcademicYear}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2021-2022">2021-2022</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Term:</span>
          <Select
            value={term}
            onValueChange={setTerm}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term1">Term 1</SelectItem>
              <SelectItem value="term2">Term 2</SelectItem>
              <SelectItem value="term3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="ml-auto">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="academic" className="animate-fade-in">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Performance by Grade
                </CardTitle>
                <CardDescription>Average scores across different grades</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={performanceByGradeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average Score (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport('grade-performance')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Average scores across different subjects</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={subjectPerformanceData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="subject" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average Score (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport('subject-performance')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="enrollment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Students by Grade
                </CardTitle>
                <CardDescription>Distribution of students across grades</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentsByGradeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentsByGradeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport('enrollment-by-grade')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Enrollment Summary
                </CardTitle>
                <CardDescription>Current enrollment statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-medium">230</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">New Enrollments (This Term):</span>
                    <span className="font-medium text-green-600">+15</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Male Students:</span>
                    <span className="font-medium">120 (52%)</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Female Students:</span>
                    <span className="font-medium">110 (48%)</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Class Size:</span>
                    <span className="font-medium">38</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teacher to Student Ratio:</span>
                    <span className="font-medium">1:15</span>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadReport('enrollment-summary')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Reports</CardTitle>
              <CardDescription>Generate specialized reports based on specific criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <FileText className="h-8 w-8 text-primary" />
                  <span>Academic Progress Report</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span>Student Performance Analytics</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <Users className="h-8 w-8 text-primary" />
                  <span>Attendance Summary</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <span>Subject-wise Analysis</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <span>Comparative Term Analysis</span>
                </Button>
                <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                  <Plus className="h-8 w-8 text-primary" />
                  <span>Create Custom Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Fix TypeScript error due to missing Plus component
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default ReportsPage;
