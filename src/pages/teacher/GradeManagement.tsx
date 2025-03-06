
import { useState } from 'react';
import { Search, Plus, Filter, Check, X } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock data
const mockStudents = [
  { id: '1', name: 'Alex Maina', class: 'Form 3A', subject: 'Mathematics', score: 78, term: 'Term 2', year: '2023' },
  { id: '2', name: 'Beatrice Wanjiku', class: 'Form 3A', subject: 'Mathematics', score: 65, term: 'Term 2', year: '2023' },
  { id: '3', name: 'Charles Omondi', class: 'Form 3A', subject: 'Mathematics', score: 82, term: 'Term 2', year: '2023' },
  { id: '4', name: 'Diana Kerubo', class: 'Form 3A', subject: 'Mathematics', score: 71, term: 'Term 2', year: '2023' },
  { id: '5', name: 'Edwin Kamau', class: 'Form 2B', subject: 'Mathematics', score: 68, term: 'Term 2', year: '2023' },
  { id: '6', name: 'Faith Njeri', class: 'Form 2B', subject: 'Mathematics', score: 87, term: 'Term 2', year: '2023' },
  { id: '7', name: 'George Wafula', class: 'Form 2B', subject: 'Mathematics', score: 74, term: 'Term 2', year: '2023' },
  { id: '8', name: 'Hannah Achieng', class: 'Form 2B', subject: 'Mathematics', score: 92, term: 'Term 2', year: '2023' },
];

const GradeManagement = () => {
  const { user, isLoading } = useRequireAuth(['teacher']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [newGradeData, setNewGradeData] = useState({
    studentName: '',
    class: '',
    score: '',
    term: 'Term 2',
    year: '2023',
    subject: 'Mathematics',
  });
  
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
  
  const handleAddGrade = () => {
    setIsAddGradeOpen(true);
  };
  
  const handleSubmitGrade = () => {
    toast.success(`Grade added for ${newGradeData.studentName}`);
    setIsAddGradeOpen(false);
    setNewGradeData({
      studentName: '',
      class: '',
      score: '',
      term: 'Term 2',
      year: '2023',
      subject: 'Mathematics',
    });
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
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
        
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Form 3A">Form 3A</SelectItem>
              <SelectItem value="Form 2B">Form 2B</SelectItem>
              <SelectItem value="Form 4A">Form 4A</SelectItem>
              <SelectItem value="Form 1C">Form 1C</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No students found. Try a different search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.subject}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full font-medium ${getScoreColor(student.score)}`}>
                      {student.score}%
                    </span>
                  </TableCell>
                  <TableCell>{student.term}, {student.year}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Comment</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Grade</DialogTitle>
            <DialogDescription>
              Enter the student information and grade details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student name"
                  value={newGradeData.studentName}
                  onChange={(e) => setNewGradeData({...newGradeData, studentName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select 
                  value={newGradeData.class}
                  onValueChange={(value) => setNewGradeData({...newGradeData, class: value})}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Form 3A">Form 3A</SelectItem>
                    <SelectItem value="Form 2B">Form 2B</SelectItem>
                    <SelectItem value="Form 4A">Form 4A</SelectItem>
                    <SelectItem value="Form 1C">Form 1C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={newGradeData.subject}
                  onChange={(e) => setNewGradeData({...newGradeData, subject: e.target.value})}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Score (%)</Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="Enter score"
                  min="0"
                  max="100"
                  value={newGradeData.score}
                  onChange={(e) => setNewGradeData({...newGradeData, score: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select 
                  value={newGradeData.term}
                  onValueChange={(value) => setNewGradeData({...newGradeData, term: value})}
                >
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select 
                  value={newGradeData.year}
                  onValueChange={(value) => setNewGradeData({...newGradeData, year: value})}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitGrade}>
              <Check className="h-4 w-4 mr-1" />
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeManagement;
