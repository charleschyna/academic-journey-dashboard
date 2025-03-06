
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
  studentId: string;
  subjectId: string;
  teacherId: string;
  score: number;
  term: string;
  academicYear: string;
  comment: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  teacherId: string;
  content: string;
  date: string;
  createdAt: string;
}

// Auth related types
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
}

// Dashboard related types
export interface DashboardStat {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
}

// Table related types
export interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (info: T) => React.ReactNode;
}
