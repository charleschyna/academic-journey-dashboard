// Main API server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Import services and middleware
import db from './db.js';
import auth from './auth.js';
import middleware from './middleware.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.initializeDatabase()
  .then(connected => {
    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Database initialization error:', err);
    process.exit(1);
  });

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await auth.register(userData);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const credentials = req.body;
    const result = await auth.login(credentials);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', middleware.authenticate, async (req, res) => {
  try {
    const profile = await auth.getUserProfile(req.user.id);
    res.status(200).json({ success: true, user: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin routes
app.get(
  '/api/admin/users',
  middleware.authenticate,
  middleware.isAdmin,
  async (req, res) => {
    try {
      const users = await db.query('SELECT * FROM profiles');
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Student routes
app.get(
  '/api/students',
  middleware.authenticate,
  async (req, res) => {
    try {
      let students;
      
      if (req.user.role === 'admin' || req.user.role === 'teacher') {
        // Admins and teachers can see all students
        students = await db.query(`
          SELECT s.*, p.first_name as parent_first_name, p.last_name as parent_last_name, p.email as parent_email
          FROM students s
          LEFT JOIN profiles p ON s.parent_id = p.id
        `);
      } else if (req.user.role === 'parent') {
        // Parents can only see their children
        students = await db.query(`
          SELECT * FROM students
          WHERE parent_id = ?
        `, [req.user.id]);
      } else {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      res.status(200).json({ success: true, students });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Grades routes
app.get(
  '/api/grades/:studentId',
  middleware.authenticate,
  middleware.canAccessStudentData,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      
      const grades = await db.query(`
        SELECT g.*, s.name as subject_name, s.code as subject_code, 
        p.first_name as teacher_first_name, p.last_name as teacher_last_name
        FROM grades g
        JOIN subjects s ON g.subject_id = s.id
        JOIN profiles p ON g.teacher_id = p.id
        WHERE g.student_id = ?
      `, [studentId]);
      
      res.status(200).json({ success: true, grades });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

app.post(
  '/api/grades',
  middleware.authenticate,
  middleware.authorize('admin', 'teacher'),
  async (req, res) => {
    try {
      const { studentId, subjectId, score, term, academicYear, comment } = req.body;
      
      // Validate data
      if (!studentId || !subjectId || score === undefined || !term || !academicYear) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      
      // Create new grade
      const gradeId = uuidv4();
      
      await db.query(`
        INSERT INTO grades (id, student_id, subject_id, teacher_id, score, term, academic_year, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [gradeId, studentId, subjectId, req.user.id, score, term, academicYear, comment || null]);
      
      res.status(201).json({ 
        success: true, 
        grade: {
          id: gradeId,
          student_id: studentId,
          subject_id: subjectId,
          teacher_id: req.user.id,
          score,
          term,
          academic_year: academicYear,
          comment: comment || null,
          created_at: new Date().toISOString()
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Feedback routes
app.get(
  '/api/feedback/:studentId',
  middleware.authenticate,
  middleware.canAccessStudentData,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      
      const feedback = await db.query(`
        SELECT f.*, p.first_name as teacher_first_name, p.last_name as teacher_last_name
        FROM feedback f
        JOIN profiles p ON f.teacher_id = p.id
        WHERE f.student_id = ?
      `, [studentId]);
      
      res.status(200).json({ success: true, feedback });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

app.post(
  '/api/feedback',
  middleware.authenticate,
  middleware.authorize('admin', 'teacher'),
  async (req, res) => {
    try {
      const { studentId, content, date } = req.body;
      
      // Validate data
      if (!studentId || !content || !date) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      
      // Create new feedback
      const feedbackId = uuidv4();
      
      await db.query(`
        INSERT INTO feedback (id, student_id, teacher_id, content, date)
        VALUES (?, ?, ?, ?, ?)
      `, [feedbackId, studentId, req.user.id, content, date]);
      
      res.status(201).json({ 
        success: true, 
        feedback: {
          id: feedbackId,
          student_id: studentId,
          teacher_id: req.user.id,
          content,
          date,
          created_at: new Date().toISOString()
        } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 