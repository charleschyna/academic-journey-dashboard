import axios from 'axios';
import { toast } from 'sonner';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong. Please try again.';
    
    // Unauthorized error, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        toast.error('Authentication expired. Please log in again.');
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API services
const services = {
  // Students
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data.students;
  },
  
  getStudentById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data.student;
  },
  
  createStudent: async (data: any) => {
    const response = await api.post('/students', data);
    return response.data.student;
  },
  
  // Grades
  getGrades: async (studentId: string) => {
    const response = await api.get(`/grades/${studentId}`);
    return response.data.grades;
  },
  
  createGrade: async (data: any) => {
    const response = await api.post('/grades', data);
    return response.data.grade;
  },
  
  // Feedback
  getFeedback: async (studentId: string) => {
    const response = await api.get(`/feedback/${studentId}`);
    return response.data.feedback;
  },
  
  createFeedback: async (data: any) => {
    const response = await api.post('/feedback', data);
    return response.data.feedback;
  },
  
  // Admin
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.users;
  },
  
  // Subjects
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data.subjects;
  },
  
  createSubject: async (data: any) => {
    const response = await api.post('/subjects', data);
    return response.data.subject;
  }
};

export default services; 