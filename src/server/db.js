// MySQL connection for the Academic Journey Dashboard
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academic_journey',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Execute query with parameters
export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a single row by ID
export const getById = async (table, id) => {
  const sql = `SELECT * FROM ${table} WHERE id = ?`;
  const results = await query(sql, [id]);
  return results[0] || null;
};

// Insert a new record
export const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  const result = await query(sql, values);
  
  return {
    id: data.id || result.insertId,
    ...data
  };
};

// Update a record
export const update = async (table, id, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  
  await query(sql, [...values, id]);
  return { id, ...data };
};

// Delete a record
export const remove = async (table, id) => {
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  await query(sql, [id]);
  return { id };
};

// Initialize database connection
export const initializeDatabase = async () => {
  return await testConnection();
};

export default { 
  query, 
  getById, 
  insert, 
  update, 
  remove,
  initializeDatabase 
}; 