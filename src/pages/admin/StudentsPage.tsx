
import { useState } from 'react';
import { Plus, Search, FileDown, User, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { useRequireAuth } from '@/lib/auth';
import PageHeader from '@/components/ui-custom/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StudentRecord } from '@/types';

const StudentsPage = () => {
  const { user, isLoading: authLoading } = useRequireAuth(['admin']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch students
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
        
      if (error) {
        toast.error('Error loading students data');
        console.error('Error fetching students:', error);
        return [];
      }
      
      return data as StudentRecord[];
    },
  });
  
  // Derived values
  const isLoading = authLoading || studentsLoading;
  const uniqueGrades = students ? [...new Set(students.map(student => student.grade).filter(Boolean))] : [];
  
  // Filter students based on search query and grade
  const filteredStudents = students?.filter(student => {
    const matchesSearch = 
      searchQuery === '' || 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admission_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });
  
  // Handlers
  const handleAddStudent = () => {
    toast.info("Opening student registration form");
    // This would typically open a form to add a new student
  };
  
  const handleEdit = (student: StudentRecord) => {
    toast.info(`Editing student: ${student.first_name} ${student.last_name}`);
    // This would typically open a form to edit the student
  };
  
  const handleDelete = (student: StudentRecord) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', selectedStudent.id);
        
      if (error) throw error;
      
      toast.success(`Student ${selectedStudent.first_name} ${selectedStudent.last_name} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete student');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <PageHeader 
        title="Students Management"
        description="View and manage all students enrolled in the school"
        action={{
          label: "Add Student",
          onClick: handleAddStudent,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 animate-fade-in">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Select
            value={selectedGrade}
            onValueChange={setSelectedGrade}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {uniqueGrades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="whitespace-nowrap">
            <FileDown className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Admission #</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Stream</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents && filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <span>{`${student.first_name} ${student.last_name}`}</span>
                  </TableCell>
                  <TableCell>{student.admission_number}</TableCell>
                  <TableCell>
                    {student.grade ? (
                      <Badge variant="outline" className="font-normal">
                        {student.grade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>{student.stream || '-'}</TableCell>
                  <TableCell>{formatDate(student.date_of_birth)}</TableCell>
                  <TableCell>
                    {student.parent_id ? (
                      <span className="text-green-600 text-sm">
                        Parent linked
                      </span>
                    ) : (
                      <span className="text-orange-600 text-sm">
                        No parent
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery || selectedGrade !== 'all' 
                    ? 'No students match your search criteria.' 
                    : 'No students have been added yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the student 
              {selectedStudent && ` "${selectedStudent.first_name} ${selectedStudent.last_name}"`}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
