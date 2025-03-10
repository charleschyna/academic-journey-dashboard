
import { useState } from 'react';
import { Search, Send, MessageSquare, Filter } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data for students
const mockStudents = [
  { id: '1', name: 'Alex Maina', class: 'Form 3A', lastFeedback: 'Great improvement in class participation' },
  { id: '2', name: 'Beatrice Wanjiku', class: 'Form 3A', lastFeedback: 'Needs to focus more during lessons' },
  { id: '3', name: 'Charles Omondi', class: 'Form 3A', lastFeedback: 'Excellent work on the recent project' },
  { id: '4', name: 'Diana Kerubo', class: 'Form 3A', lastFeedback: null },
  { id: '5', name: 'Edwin Kamau', class: 'Form 2B', lastFeedback: 'Has been struggling with the new topics' },
  { id: '6', name: 'Faith Njeri', class: 'Form 2B', lastFeedback: 'Outstanding performance in class' },
  { id: '7', name: 'George Wafula', class: 'Form 2B', lastFeedback: null },
  { id: '8', name: 'Hannah Achieng', class: 'Form 2B', lastFeedback: 'Very attentive and participates actively' },
];

// Mock data for recent feedback
const mockFeedback = [
  { id: '1', studentName: 'Alex Maina', studentId: '1', class: 'Form 3A', content: 'Great improvement in class participation. Keep up the good work!', date: '2023-06-15T10:30:00Z' },
  { id: '2', studentName: 'Beatrice Wanjiku', studentId: '2', class: 'Form 3A', content: 'Needs to focus more during lessons. Has been distracted lately.', date: '2023-06-10T14:45:00Z' },
  { id: '3', studentName: 'Edwin Kamau', studentId: '5', class: 'Form 2B', content: 'Has been struggling with the new topics. Would benefit from some extra help.', date: '2023-06-08T11:15:00Z' },
  { id: '4', studentName: 'Charles Omondi', studentId: '3', class: 'Form 3A', content: 'Excellent work on the recent project. Shows great understanding of the subject.', date: '2023-06-05T09:20:00Z' },
  { id: '5', studentName: 'Faith Njeri', studentId: '6', class: 'Form 2B', content: 'Outstanding performance in class. One of the top performers consistently.', date: '2023-06-01T13:40:00Z' },
];

// Mock classes data
const mockClasses = ['Form 3A', 'Form 2B', 'Form 4A', 'Form 1C'];

const FeedbackManagement = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [isCreateFeedbackOpen, setIsCreateFeedbackOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudents)[0] | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  
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
    return matchesSearch && matchesClass;
  });
  
  const handleOpenFeedbackDialog = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);
    setFeedbackText('');
    setIsCreateFeedbackOpen(true);
  };
  
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter feedback content');
      return;
    }
    
    toast.success(`Feedback sent to ${selectedStudent?.name}`);
    setIsCreateFeedbackOpen(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Student Feedback"
        description="Provide feedback and comments to students"
        action={{
          label: "Create Feedback",
          onClick: () => setIsCreateFeedbackOpen(true),
          icon: <Send className="h-4 w-4" />,
        }}
      />
      
      <Tabs defaultValue="students">
        <TabsList className="w-full md:w-auto grid grid-cols-2 mb-6">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="recent">Recent Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No students found. Try a different search or filter.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <Card key={student.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{student.name}</CardTitle>
                          <CardDescription>{student.class}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Last feedback:</p>
                    <p className="text-sm">
                      {student.lastFeedback 
                        ? student.lastFeedback 
                        : <span className="text-muted-foreground italic">No feedback provided yet</span>}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => handleOpenFeedbackDialog(student)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Feedback
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="animate-fade-in">
          <div className="space-y-4">
            {mockFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-base">{feedback.studentName}</CardTitle>
                      <CardDescription>{feedback.class} - {formatDate(feedback.date)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{feedback.content}</p>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const student = mockStudents.find(s => s.id === feedback.studentId);
                      if (student) {
                        handleOpenFeedbackDialog(student);
                      }
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send New
                  </Button>
                  <Button variant="secondary" size="sm">
                    View History
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create Feedback Dialog */}
      <Dialog open={isCreateFeedbackOpen} onOpenChange={setIsCreateFeedbackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              {selectedStudent 
                ? `Send feedback to ${selectedStudent.name} (${selectedStudent.class})`
                : 'Select a student and write your feedback'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!selectedStudent && (
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback Message</Label>
              <Textarea
                id="feedback"
                placeholder="Enter your feedback to the student..."
                className="min-h-[120px]"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select defaultValue="student-parent">
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student-parent">Student & Parent</SelectItem>
                  <SelectItem value="student">Student Only</SelectItem>
                  <SelectItem value="parent">Parent Only</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback}>
              <Send className="h-4 w-4 mr-1" />
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackManagement;
