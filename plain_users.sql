-- Insert Admin User with direct values
-- Admin: email=admin@school.com, password=adminpassword

-- Insert admin user
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'admin@school.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

-- Insert admin profile
INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890', 'Admin', 'User', 'admin@school.com', 'admin', NOW());

-- Insert teacher user
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
('b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 'teacher@school.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

-- Insert teacher profile
INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
('b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 'Teacher', 'User', 'teacher@school.com', 'teacher', NOW());

-- Insert teacher record
INSERT INTO teachers (id, user_id, created_at)
VALUES 
('c3d4e5f6-a1b2-7890-c3d4-e5f6a1b27890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', NOW());

-- Insert parent user
INSERT INTO users (id, email, password_hash, created_at)
VALUES 
('d4e5f6a1-b2c3-7890-d4e5-f6a1b2c37890', 'parent@email.com', '$2a$10$dXBEywfLDjqy/pZJC1Fw/efNi8EdxdX.qLH8uJd70JQFeVhXYnlm.', NOW());

-- Insert parent profile
INSERT INTO profiles (id, first_name, last_name, email, role, created_at)
VALUES 
('d4e5f6a1-b2c3-7890-d4e5-f6a1b2c37890', 'Parent', 'User', 'parent@email.com', 'parent', NOW());

-- Insert student record
INSERT INTO students (id, first_name, last_name, admission_number, date_of_birth, grade, parent_id, created_at)
VALUES 
('e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'Student', 'Child', 'STU001', '2010-05-15', 'Grade 7', 'd4e5f6a1-b2c3-7890-d4e5-f6a1b2c37890', NOW()); 