// Authentication service using MySQL and JWT
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUsers = await db.query('SELECT * FROM users WHERE email = ?', [userData.email]);
    if (existingUsers.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Generate UUID
    const userId = uuidv4();
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Begin transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create user
      await connection.execute(
        'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
        [userId, userData.email, hashedPassword]
      );

      // Create profile
      await connection.execute(
        'INSERT INTO profiles (id, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?)',
        [userId, userData.firstName, userData.lastName, userData.email, userData.role || 'parent']
      );

      // If user is a parent and child details are provided, create child record
      if (userData.role === 'parent' && userData.childDetails) {
        const childId = uuidv4();
        await connection.execute(
          'INSERT INTO students (id, first_name, last_name, admission_number, date_of_birth, grade, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            childId,
            userData.childDetails.firstName,
            userData.childDetails.lastName,
            userData.childDetails.admissionNumber,
            userData.childDetails.dateOfBirth,
            userData.childDetails.grade,
            userId
          ]
        );
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      // Get user profile
      const profile = await db.query('SELECT * FROM profiles WHERE id = ?', [userId]);
      
      return {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'parent',
        createdAt: profile[0].created_at
      };
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // Find user by email
    const users = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
    
    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = users[0];
    
    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Get user profile with role
    const profiles = await db.query('SELECT * FROM profiles WHERE id = ?', [user.id]);
    
    if (profiles.length === 0) {
      throw new Error('User profile not found');
    }
    
    const profile = profiles[0];
    
    // Create user object
    const userObj = {
      id: user.id,
      email: user.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      createdAt: profile.created_at
    };
    
    // Generate token
    const token = generateToken(userObj);
    
    return {
      user: userObj,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const profiles = await db.query('SELECT * FROM profiles WHERE id = ?', [userId]);
    
    if (profiles.length === 0) {
      throw new Error('User profile not found');
    }
    
    const profile = profiles[0];
    
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      createdAt: profile.created_at
    };
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export default {
  register,
  login,
  getUserProfile,
  generateToken,
  verifyToken,
  hashPassword,
  verifyPassword
}; 