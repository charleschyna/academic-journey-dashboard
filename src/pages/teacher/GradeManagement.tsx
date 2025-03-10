
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Check, X, FileText, MessageSquare, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock data for classes and subjects
const mockClasses = ['Form 3A', 'Form 2B', 'Form 4A', 'Form 1C'];
const mockSubjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];

// Mock data for students
const mockStudents = [
  { id: '1', name: 'Alex Maina', class: 'Form 3A', subject: 'Mathematics', score: 78, termWork: 25, finalExam: 53, term: 'Term 2', year: '2023' },
  { id: '2', name: 'Beatrice Wanjiku', class: 'Form 3A', subject: 'Mathematics', score: 65, termWork: 20, finalExam: 45, term: 'Term 2', year: '2023' },
  { id: '3', name: 'Charles Omondi', class: 'Form 3A', subject: 'Mathematics', score: 82, termWork: 28, finalExam: 54, term: 'Term 2', year: '2023' },
  { id: '4', name: 'Diana Kerubo', class: 'Form 3A', subject: 'Mathematics', score: 71, termWork: 22, finalExam: 49, term: 'Term 2', year: '2023' },
  { id: '5', name: 'Edwin Kamau', class: 'Form 2B', subject: 'Mathematics', score: 68, termWork: 21, finalExam: 47, term: 'Term 2', year: '2023' },
  { id: '6', name: 'Faith Njeri', class: 'Form 2B', subject: 'Mathematics', score: 87, termWork: 29, finalExam: 58, term: 'Term 2', year: '2023' },
  { id: '7', name: 'George Wafula', class: 'Form 2B', subject: 'Mathematics', score: 74, termWork: 24, finalExam: 50, term: 'Term 2', year: '2023' },
  { id: '8', name: 'Hannah Achieng', class: 'Form 2B', subject: 'Mathematics', score: 92, termWork: 30, finalExam: 62, term: 'Term 2', year: '2023' },
];

// Assessment types
const assessmentTypes = [
  { id: 'cat1', name: 'CAT 1', weight: 10 },
  { id: 'cat2', name: 'CAT 2', weight: 10 },
  { id: 'termWork', name: 'Term Work', weight: 30 },
  { id: 'finalExam', name: 'Final Exam', weight: 70 },
];

const GradeManagement = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all-grades');
  
  // Dialogs
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isViewAssessmentsOpen, setIsViewAssessmentsOpen] = useState(false);
  
  // Selected student for operations
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudents)[0] | null>(null);
  
  // Form data
  const [newGradeData, setNewGradeData] = useState({
    studentName: '',
    class: '',
    subject: 'Mathematics',
    termWork: '',
    finalExam: '',
    term: 'Term 2',
    year: '2023',
  });
  
  const [feedbackData, setFeedbackData] = useState({
    content: '',
  });
  
  // Calculate total score (30% term work + 70% final exam)
  const calculateTotalScore = (termWork: number, finalExam: number) => {
    return Math.round((termWork * 0.3) + (finalExam * 0.7));
  };
  
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSubject = !selectedSubject || student.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });
  
  const handleAddGrade = () => {
    setNewGradeData({
      studentName: '',
      class: '',
      subject: 'Mathematics',
      termWork: '',
      finalExam: '',
      term: 'Term 2',
      year: '2023',
    });
    setIsAddGradeOpen(true);
  };
  
  const handleEditGrade = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);
    setNewGradeData({
      studentName: student.name,
      class: student.class,
      subject: student.subject,
      termWork: student.termWork.toString(),
      finalExam: student.finalExam.toString(),
      term: student.term,
      year: student.year,
    });
    setIsAddGradeOpen(true);
  };
  
  const handleSendFeedback = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);
    setFeedbackData({
      content: '',
    });
    setIsFeedbackOpen(true);
  };
  
  const handleViewAssessments = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);
    setIsViewAssessmentsOpen(true);
  };
  
  const handleSubmitGrade = () => {
    if (!newGradeData.termWork || !newGradeData.finalExam) {
      toast.error('Please enter all required scores');
      return;
    }
    
    const termWorkScore = parseInt(newGradeData.termWork);
    const finalExamScore = parseInt(newGradeData.finalExam);
    
    if (isNaN(termWorkScore) || isNaN(finalExamScore)) {
      toast.error('Scores must be valid numbers');
      return;
    }
    
    if (termWorkScore < 0 || termWorkScore > 30 || finalExamScore < 0 || finalExamScore > 70) {
      toast.error('Scores must be within valid ranges (0-30 for term work, 0-70 for final exam)');
      return;
    }
    
    if (selectedStudent) {
      toast.success(`Grade updated for ${selectedStudent.name}`);
    } else {
      toast.success(`Grade added for ${newGradeData.studentName}`);
    }
    
    setIsAddGradeOpen(false);
  };
  
  const handleSubmitFeedback = () => {
    if (!feedbackData.content.trim()) {
      toast.error('Please enter feedback content');
      return;
    }
    
    toast.success(`Feedback sent to ${selectedStudent?.name}`);
    setIsFeedbackOpen(false);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 80) return 'A';
    if (score >= 75) return 'A-';
    if (score >= 70) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 60) return 'B-';
    if (score >= 55) return 'C+';
    if (score >= 50) return 'C';
    if (score >= 45) return 'C-';
    if (score >= 40) return 'D+';
    if (score >= 35) return 'D';
    if (score >= 30) return 'D-';
    return 'E';
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Manage Grades"
        description="Record and manage student grades"
        action={{
          label: "Add Grade",
          onClick: handleAddGrade,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <Tabs defaultValue="all-grades" className="w-full animate-fade-in" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="all-grades">All Grades</TabsTrigger>
          <TabsTrigger value="pending-grades">Pending Assessments</TabsTrigger>
          <TabsTrigger value="analytics" className="hidden md:inline-flex">Class Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-grades">
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border animate-fade-in overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Term</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No students found. Try a different search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.subject}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2.5 py-1 rounded-full font-medium ${getScoreColor(student.score)}`}>
                          {student.score}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {getGradeFromScore(student.score)}
                      </TableCell>
                      <TableCell className="text-center">{student.term}, {student.year}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditGrade(student)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendFeedback(student)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleViewAssessments(student)}>
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending-grades">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockClasses.map((cls) => (
              <Card key={cls}>
                <CardHeader className="pb-2">
                  <CardTitle>{cls}</CardTitle>
                  <CardDescription>Pending assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSubjects.slice(0, 3).map((subject) => (
                      <div key={`${cls}-${subject}`} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{subject}</p>
                          <p className="text-sm text-muted-foreground">Term 2 CAT</p>
                        </div>
                        <Button variant="secondary" size="sm">Grade</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">View All</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>Average scores by class</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <p className="ml-2">Charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <p className="ml-2">Charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Number of students by grade</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <p className="ml-2">Charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Grade Dialog */}
      <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedStudent ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
            <DialogDescription>
              {selectedStudent 
                ? `Update grades for ${selectedStudent.name}` 
                : 'Enter the student information and grade details below.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="text"
                name="studentName"
                label="Student Name"
                value={newGradeData.studentName}
                onChange={(value) => setNewGradeData({...newGradeData, studentName: value})}
                disabled={!!selectedStudent}
                required
              />
              
              <FormField
                type="select"
                name="class"
                label="Class"
                value={newGradeData.class}
                onChange={(value) => setNewGradeData({...newGradeData, class: value})}
                options={mockClasses.map(cls => ({ value: cls, label: cls }))}
                disabled={!!selectedStudent}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="select"
                name="subject"
                label="Subject"
                value={newGradeData.subject}
                onChange={(value) => setNewGradeData({...newGradeData, subject: value})}
                options={mockSubjects.map(subject => ({ value: subject, label: subject }))}
                required
              />
              
              <FormField
                type="select"
                name="term"
                label="Term"
                value={newGradeData.term}
                onChange={(value) => setNewGradeData({...newGradeData, term: value})}
                options={[
                  { value: 'Term 1', label: 'Term 1' },
                  { value: 'Term 2', label: 'Term 2' },
                  { value: 'Term 3', label: 'Term 3' },
                ]}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="number"
                name="termWork"
                label="Term Work"
                description="30% of final grade (0-30)"
                value={newGradeData.termWork}
                onChange={(value) => setNewGradeData({...newGradeData, termWork: value})}
                min={0}
                max={30}
                required
              />
              
              <FormField
                type="number"
                name="finalExam"
                label="Final Exam"
                description="70% of final grade (0-70)"
                value={newGradeData.finalExam}
                onChange={(value) => setNewGradeData({...newGradeData, finalExam: value})}
                min={0}
                max={70}
                required
              />
            </div>
            
            {newGradeData.termWork && newGradeData.finalExam && (
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="font-medium">Calculated Final Score</div>
                <div className="text-2xl font-bold mt-1">
                  {calculateTotalScore(Number(newGradeData.termWork), Number(newGradeData.finalExam))}%
                  <span className="ml-2 text-lg">
                    (Grade {getGradeFromScore(calculateTotalScore(Number(newGradeData.termWork), Number(newGradeData.finalExam)))})
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitGrade}>
              <Check className="h-4 w-4 mr-1" />
              {selectedStudent ? 'Update Grade' : 'Save Grade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              {selectedStudent && `Send feedback to ${selectedStudent.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback Message</Label>
              <Textarea
                id="feedback"
                placeholder="Enter your feedback to the student..."
                className="min-h-[120px]"
                value={feedbackData.content}
                onChange={(e) => setFeedbackData({...feedbackData, content: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitFeedback}>
              <Check className="h-4 w-4 mr-1" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Assessments Dialog */}
      <Dialog open={isViewAssessmentsOpen} onOpenChange={setIsViewAssessmentsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              {selectedStudent && `Assessment breakdown for ${selectedStudent.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead className="text-center">Weight</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-right">Weighted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>CAT 1</TableCell>
                  <TableCell className="text-center">10%</TableCell>
                  <TableCell className="text-center">76%</TableCell>
                  <TableCell className="text-right">7.6</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CAT 2</TableCell>
                  <TableCell className="text-center">10%</TableCell>
                  <TableCell className="text-center">82%</TableCell>
                  <TableCell className="text-right">8.2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Term Work</TableCell>
                  <TableCell className="text-center">30%</TableCell>
                  <TableCell className="text-center">{selectedStudent?.termWork}%</TableCell>
                  <TableCell className="text-right">{selectedStudent ? (selectedStudent.termWork * 0.3).toFixed(1) : '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Final Exam</TableCell>
                  <TableCell className="text-center">70%</TableCell>
                  <TableCell className="text-center">{selectedStudent?.finalExam}%</TableCell>
                  <TableCell className="text-right">{selectedStudent ? (selectedStudent.finalExam * 0.7).toFixed(1) : '-'}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Final Grade</TableCell>
                  <TableCell className="text-center">100%</TableCell>
                  <TableCell className="text-center">{selectedStudent?.score}%</TableCell>
                  <TableCell className="text-right">{getGradeFromScore(selectedStudent?.score || 0)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6">
              <div className="font-medium mb-2">Recent Feedback</div>
              <div className="text-sm text-muted-foreground italic">
                "Good improvement from the previous assessment. Keep practicing problem-solving skills."
              </div>
              <div className="text-xs text-muted-foreground mt-1">May 15, 2023</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewAssessmentsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeManagement;
