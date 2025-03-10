export interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  dateOfBirth: string;
  grade: string;
  stream: string;
  parentId: string | null;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  subjectsTaught: string[];
  createdAt: string;
}

export interface Parent {
  id: string;
  userId: string;
  children: string[]; // Array of student IDs
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
  score: number;
  term: string;
  year: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  teacherId: string;
  content: string;
  date: string;
  createdAt: string;
}

export interface ChildDetails {
  firstName: string;
  lastName: string;
  admissionNumber: string;
  dateOfBirth: string;
  grade: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role?: 'admin' | 'teacher' | 'parent';
  childDetails?: ChildDetails;
}

export interface DashboardStat {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
}

export interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (info: T) => React.ReactNode;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  created_at: string;
  updated_at: string;
}

export interface StudentRecord {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  date_of_birth: string;
  grade: string;
  stream: string;
  parent_id: string | null;
  created_at: string;
}

export interface GradeRecord {
  id: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
  score: number;
  term: string;
  year: number;
  created_at: string;
  subjects: {
    name: string;
    code: string;
    id: string;
    created_at: string;
  };
  teachers: {
    first_name: string;
    last_name: string;
  };
}

export interface FeedbackRecord {
  id: string;
  student_id: string;
  teacher_id: string;
  comment: string;
  created_at: string;
  teachers: {
    first_name: string;
    last_name: string;
  };
  subjects?: {
    name: string;
  };
}

export interface SubjectWithTeachers extends Subject {
  teachers: string[];
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'academic' | 'behavior' | 'attendance';
  studentId: string;
  downloadUrl?: string;
}
