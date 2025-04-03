// Script to fix user password with a fresh bcrypt hash
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

// Create database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Add your XAMPP MySQL password if different
  database: 'academic_journey',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Generate a new password hash
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Update user password
async function updateUserPassword(email, newPassword) {
  try {
    console.log(`Updating password for user: ${email}`);
    
    // Get user
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.error(`User not found with email: ${email}`);
      return false;
    }
    
    const user = users[0];
    console.log(`Found user with ID: ${user.id}`);
    
    // Generate new hash
    const newHash = await hashPassword(newPassword);
    console.log(`Generated new hash: ${newHash}`);
    
    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, user.id]
    );
    
    console.log('✅ Password updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Update admin password
    await updateUserPassword('admin@school.com', 'adminpassword');
    
    // Update teacher password
    await updateUserPassword('teacher@school.com', 'adminpassword');
    
    // Update parent password
    await updateUserPassword('parent@email.com', 'adminpassword');
    
    // Close connection
    await pool.end();
  } catch (error) {
    console.error('Script failed:', error);
  }
}

// Run the script
main(); 