import { createClient } from '@supabase/supabase-js';
import { Grade, Student, Subject, User, Profile, StudentRecord, GradeRecord, FeedbackRecord } from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// User functions
export const getProfile = async (userId: string) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data as Profile;
};

// Student functions
export const getStudents = async () => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }
  
  return data as StudentRecord[];
};

export const getStudentById = async (id: string) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching student:', error);
    return null;
  }
  
  return data as StudentRecord;
};

export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('students')
    .insert([
      {
        first_name: student.firstName,
        last_name: student.lastName,
        admission_number: student.admissionNumber,
        date_of_birth: student.dateOfBirth,
        grade: student.grade,
        stream: student.stream,
        parent_id: student.parentId
      }
    ])
    .select();
    
  if (error) {
    console.error('Error adding student:', error);
    throw error;
  }
  
  return data;
};

// Subject functions
export const getSubjects = async () => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  return data as Subject[];
};

export const addSubject = async (subject: Omit<Subject, 'id' | 'createdAt'>) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('subjects')
    .insert([
      {
        name: subject.name,
        code: subject.code
      }
    ])
    .select();
    
  if (error) {
    console.error('Error adding subject:', error);
    throw error;
  }
  
  return data;
};

// Grade functions
export const getGrades = async (studentId?: string) => {
  if (!supabase) return [];
  
  let query = supabase
    .from('grades')
    .select(`
      *,
      subjects (
        name,
        code,
        id,
        created_at
      ),
      teachers (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false });
    
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching grades:', error);
    return [];
  }
  
  return data as GradeRecord[];
};

export const addGrade = async (grade: Omit<Grade, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('grades')
    .insert([
      {
        student_id: grade.student_id,
        subject_id: grade.subject_id,
        teacher_id: grade.teacher_id,
        score: grade.score,
        term: grade.term,
        year: grade.year
      }
    ])
    .select();

  if (error) {
    throw error;
  }
  
  return data;
};

// Feedback functions
export const getFeedback = async (studentId?: string) => {
  if (!supabase) return [];
  
  let query = supabase
    .from('feedback')
    .select(`
      *,
      teachers (
        first_name,
        last_name
      ),
      subjects (
        name
      )
    `)
    .order('created_at', { ascending: false });
    
  if (studentId) {
    query = query.eq('student_id', studentId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
  
  return data as FeedbackRecord[];
};

export const addFeedback = async (feedback: {
  student_id: string;
  teacher_id: string;
  comment: string;
}) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedback])
    .select();
    
  if (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
  
  return data;
};

// Teacher functions
export const getTeachers = async () => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'teacher')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
  
  return data as User[];
};

// Parent functions
export const getParents = async () => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'parent')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching parents:', error);
    return [];
  }
  
  return data as User[];
};

// Get students for a specific parent
export const getParentStudents = async (parentId: string) => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching parent students:', error);
    return [];
  }
  
  return data as StudentRecord[];
};
