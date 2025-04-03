// Middleware for authorization
import auth from './auth.js';

// Extract JWT token from request
export const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// Authenticate user middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token
    const decoded = auth.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Set user in request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Authorize by role middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
    }
    
    next();
  };
};

// Check if user is an admin
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Check if user is a teacher
export const isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access required' });
  }
  
  next();
};

// Check if user is a parent
export const isParent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return res.status(403).json({ error: 'Parent access required' });
  }
  
  next();
};

// Check if user can access student data
// Admins and teachers can access any student data
// Parents can only access their children's data
export const canAccessStudentData = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const studentId = req.params.studentId || req.body.studentId;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID required' });
    }
    
    // Admins and teachers can access any student data
    if (req.user.role === 'admin' || req.user.role === 'teacher') {
      return next();
    }
    
    // Parents can only access their children's data
    if (req.user.role === 'parent') {
      const db = require('./db').default;
      const students = await db.query(
        'SELECT * FROM students WHERE id = ? AND parent_id = ?',
        [studentId, req.user.id]
      );
      
      if (students.length === 0) {
        return res.status(403).json({ error: 'Access denied. Not your child' });
      }
      
      return next();
    }
    
    // Default deny
    return res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    console.error('Student access check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  authenticate,
  authorize,
  isAdmin,
  isTeacher,
  isParent,
  canAccessStudentData
}; 