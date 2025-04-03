// Test script for login authentication
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

// Test function to get user by email
async function getUserByEmail(email) {
  try {
    const [results] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User query results:', results.length > 0 ? 'User found' : 'User not found');
    return results[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Test function to verify password
async function verifyPassword(password, hashedPassword) {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification result:', isValid ? 'Valid' : 'Invalid');
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Test login function
async function testLogin(email, password) {
  console.log(`Testing login for ${email}...`);
  
  // Step 1: Get user
  const user = await getUserByEmail(email);
  if (!user) {
    console.error('❌ Login failed: User not found');
    return false;
  }
  
  console.log('User found with ID:', user.id);
  console.log('Stored password hash:', user.password_hash);
  
  // Step 2: Verify password
  const isPasswordValid = await verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    console.error('❌ Login failed: Invalid password');
    return false;
  }
  
  // Step 3: Get user profile
  try {
    const [profiles] = await pool.execute('SELECT * FROM profiles WHERE id = ?', [user.id]);
    if (profiles.length === 0) {
      console.error('❌ Login failed: User profile not found');
      return false;
    }
    
    const profile = profiles[0];
    console.log('✅ Login successful!');
    console.log('User profile:', {
      id: user.id,
      email: user.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role
    });
    
    return true;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return false;
  }
}

// Create a new valid hash for testing
async function generateNewHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(`New hash for '${password}':`, hash);
  return hash;
}

// Main function
async function main() {
  try {
    // Generate a new hash for comparison
    await generateNewHash('adminpassword');
    
    // Test admin login
    await testLogin('admin@school.com', 'adminpassword');
    
    // Close connection
    await pool.end();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
main(); 