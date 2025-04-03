-- Insert Admin User
-- This creates an admin user with email: admin@school.com and password: adminpassword

-- Generate a UUID for the user ID
SET @userId = UUID();

-- Insert into users table with bcrypt hashed password
-- Hash for 'adminpassword' - this is a simpler hash that should work with XAMPP
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
(@userId, 'admin@school.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

-- Insert into profiles table with admin role
INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
(@userId, 'Admin', 'User', 'admin@school.com', 'admin', NOW());

-- Also create a test teacher account
SET @teacherId = UUID();
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
(@teacherId, 'teacher@school.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
(@teacherId, 'Teacher', 'User', 'teacher@school.com', 'teacher', NOW());

-- Create a teacher record
INSERT INTO teachers (id, user_id, created_at)
VALUES 
(UUID(), @teacherId, NOW());

-- Also create a test parent account
SET @parentId = UUID();
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
(@parentId, 'parent@email.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
(@parentId, 'Parent', 'User', 'parent@email.com', 'parent', NOW());

-- Create a student linked to the parent
INSERT INTO students (id, first_name, last_name, admission_number, date_of_birth, grade, parent_id, created_at)
VALUES 
(UUID(), 'Student', 'Child', 'STU001', '2010-05-15', 'Grade 7', @parentId, NOW()); 