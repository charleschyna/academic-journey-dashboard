// MySQL client for the Academic Journey Dashboard
import axios from 'axios';

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

// Database client for common operations
export const mysqlClient = {
  // Students
  students: {
    getAll: async () => {
      const response = await api.get('/students');
      return response.data.students;
    },
    getById: async (id: string) => {
      const response = await api.get(`/students/${id}`);
      return response.data.student;
    },
    create: async (data: any) => {
      const response = await api.post('/students', data);
      return response.data.student;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/students/${id}`, data);
      return response.data.student;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    }
  },
  
  // Grades
  grades: {
    getByStudent: async (studentId: string) => {
      const response = await api.get(`/grades/${studentId}`);
      return response.data.grades;
    },
    create: async (data: any) => {
      const response = await api.post('/grades', data);
      return response.data.grade;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/grades/${id}`, data);
      return response.data.grade;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/grades/${id}`);
      return response.data;
    }
  },
  
  // Feedback
  feedback: {
    getByStudent: async (studentId: string) => {
      const response = await api.get(`/feedback/${studentId}`);
      return response.data.feedback;
    },
    create: async (data: any) => {
      const response = await api.post('/feedback', data);
      return response.data.feedback;
    }
  },
  
  // Subjects
  subjects: {
    getAll: async () => {
      const response = await api.get('/subjects');
      return response.data.subjects;
    },
    create: async (data: any) => {
      const response = await api.post('/subjects', data);
      return response.data.subject;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data.subject;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    }
  },
  
  // Users (profiles)
  users: {
    getAll: async () => {
      const response = await api.get('/admin/users');
      return response.data.users;
    }
  },
  
  // Dashboard stats
  stats: {
    getAdminStats: async () => {
      const response = await api.get('/admin/stats');
      return response.data.stats;
    },
    getTeacherStats: async () => {
      const response = await api.get('/teacher/stats');
      return response.data.stats;
    },
    getParentStats: async () => {
      const response = await api.get('/parent/stats');
      return response.data.stats;
    }
  }
}; 