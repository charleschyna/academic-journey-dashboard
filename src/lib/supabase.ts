
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { 
  Student, 
  Teacher, 
  Parent, 
  Subject, 
  Grade, 
  Feedback,
  Profile
} from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Profiles
export const getProfiles = async (role?: 'admin' | 'teacher' | 'parent') => {
  try {
    let query = supabase.from('profiles').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Profile[];
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch profiles');
    return [];
  }
};

// Students
export const getStudents = async (parentId?: string) => {
  try {
    let query = supabase.from('students').select('*');
    
    if (parentId) {
      query = query.eq('parent_id', parentId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      admissionNumber: item.admission_number,
      dateOfBirth: item.date_of_birth,
      grade: item.grade,
      stream: item.stream,
      parentId: item.parent_id,
      createdAt: item.created_at,
    })) as Student[];
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch students');
    return [];
  }
};

export const createStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase.from('students').insert([
      {
        first_name: student.firstName,
        last_name: student.lastName,
        admission_number: student.admissionNumber,
        date_of_birth: student.dateOfBirth,
        grade: student.grade,
        stream: student.stream,
        parent_id: student.parentId,
      }
    ]).select();
    
    if (error) throw error;
    
    toast.success('Student created successfully');
    return data[0];
  } catch (error: any) {
    toast.error(error.message || 'Failed to create student');
    return null;
  }
};

// Teachers
export const getTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*, profiles(*)');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      subjectsTaught: item.subjects_taught,
      createdAt: item.created_at,
      firstName: item.profiles?.first_name,
      lastName: item.profiles?.last_name,
      email: item.profiles?.email,
    }));
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch teachers');
    return [];
  }
};

// Subjects
export const getSubjects = async () => {
  try {
    const { data, error } = await supabase.from('subjects').select('*');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      code: item.code,
      createdAt: item.created_at,
    })) as Subject[];
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch subjects');
    return [];
  }
};

// Grades
export const getGrades = async (studentId?: string, teacherId?: string) => {
  try {
    let query = supabase
      .from('grades')
      .select('*, students(*), subjects(*), profiles(*)');
    
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    if (teacherId) {
      query = query.eq('teacher_id', teacherId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      studentId: item.student_id,
      subjectId: item.subject_id,
      teacherId: item.teacher_id,
      score: item.score,
      term: item.term,
      academicYear: item.academic_year,
      comment: item.comment,
      createdAt: item.created_at,
      studentName: `${item.students?.first_name} ${item.students?.last_name}`,
      subjectName: item.subjects?.name,
      teacherName: `${item.profiles?.first_name} ${item.profiles?.last_name}`,
    }));
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch grades');
    return [];
  }
};

export const createGrade = async (grade: Omit<Grade, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase.from('grades').insert([
      {
        student_id: grade.studentId,
        subject_id: grade.subjectId,
        teacher_id: grade.teacherId,
        score: grade.score,
        term: grade.term,
        academic_year: grade.academicYear,
        comment: grade.comment,
      }
    ]).select();
    
    if (error) throw error;
    
    toast.success('Grade recorded successfully');
    return data[0];
  } catch (error: any) {
    toast.error(error.message || 'Failed to record grade');
    return null;
  }
};

// Feedback
export const getFeedback = async (studentId?: string) => {
  try {
    let query = supabase
      .from('feedback')
      .select('*, students(*), profiles(*)');
    
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      studentId: item.student_id,
      teacherId: item.teacher_id,
      content: item.content,
      date: item.date,
      createdAt: item.created_at,
      studentName: `${item.students?.first_name} ${item.students?.last_name}`,
      teacherName: `${item.profiles?.first_name} ${item.profiles?.last_name}`,
    })) as Feedback[];
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch feedback');
    return [];
  }
};

export const createFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase.from('feedback').insert([
      {
        student_id: feedback.studentId,
        teacher_id: feedback.teacherId,
        content: feedback.content,
        date: feedback.date,
      }
    ]).select();
    
    if (error) throw error;
    
    toast.success('Feedback sent successfully');
    return data[0];
  } catch (error: any) {
    toast.error(error.message || 'Failed to send feedback');
    return null;
  }
};
