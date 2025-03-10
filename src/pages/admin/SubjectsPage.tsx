
import { useState } from 'react';
import { Plus, Search, Edit, Trash, MoreHorizontal, Book } from 'lucide-react';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SubjectWithTeachers {
  id: string;
  name: string;
  code: string;
  created_at: string;
  teacher_count?: number;
}

const SubjectsPage = () => {
  const { user, isLoading: authLoading } = useRequireAuth(['admin']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithTeachers | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch subjects with teacher counts
  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*');
        
      if (error) {
        toast.error('Error loading subjects data');
        console.error('Error fetching subjects:', error);
        return [];
      }
      
      // For now, we'll add a mock teacher count (in a real app, we'd join with teachers table)
      return data.map(subject => ({
        ...subject,
        teacher_count: Math.floor(Math.random() * 5) + 1 // Mock data for demonstration
      })) as SubjectWithTeachers[];
    },
  });
  
  const isLoading = authLoading || subjectsLoading;
  
  // Filter subjects based on search query
  const filteredSubjects = subjects?.filter(subject => {
    return searchQuery === '' || 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Handlers
  const handleAddSubject = () => {
    toast.info("Opening subject creation form");
    // This would typically open a form to add a new subject
  };
  
  const handleEdit = (subject: SubjectWithTeachers) => {
    toast.info(`Editing subject: ${subject.name}`);
    // This would typically open a form to edit the subject
  };
  
  const handleDelete = (subject: SubjectWithTeachers) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedSubject) return;
    
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', selectedSubject.id);
        
      if (error) throw error;
      
      toast.success(`Subject ${selectedSubject.name} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedSubject(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subject');
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
  
  // Generate random color for subject cards
  const getSubjectColor = (code: string) => {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-amber-100 text-amber-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    const index = code.charCodeAt(0) % colors.length;
    return colors[index];
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
        title="Subjects Management"
        description="View and manage all academic subjects"
        action={{
          label: "Add Subject",
          onClick: handleAddSubject,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">List View</Button>
          <Button variant="outline">Grid View</Button>
        </div>
      </div>
      
      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
        {filteredSubjects && filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <Card key={subject.id} className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>Code: {subject.code}</CardDescription>
                  </div>
                  <Badge variant="outline" className={getSubjectColor(subject.code)}>
                    {subject.code}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Teachers: {subject.teacher_count}</span>
                  <span>Added: {formatDate(subject.created_at)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(subject)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600" 
                  onClick={() => handleDelete(subject)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <Book className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-2" />
            <h3 className="text-lg font-medium mb-1">No subjects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No subjects match your search criteria.' : 'No subjects have been added yet.'}
            </p>
            <Button onClick={handleAddSubject}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Subject
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the subject
              {selectedSubject && ` "${selectedSubject.name} (${selectedSubject.code})"`}? 
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

export default SubjectsPage;
