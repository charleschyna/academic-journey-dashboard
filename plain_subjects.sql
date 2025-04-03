-- Insert Sample Subjects with direct values

-- Insert subjects
INSERT INTO subjects (id, name, code, created_at)
VALUES 
('f6a1b2c3-d4e5-7890-f6a1-b2c3d4e57890', 'Mathematics', 'MATH101', NOW()),
('a1b2c3d4-f6a1-7890-a1b2-c3d4f6a17890', 'English', 'ENG101', NOW()),
('b2c3d4e5-a1b2-7890-b2c3-d4e5a1b27890', 'Science', 'SCI101', NOW()),
('c3d4e5f6-b2c3-7890-c3d4-e5f6b2c37890', 'History', 'HIST101', NOW()),
('d4e5f6a1-c3d4-7890-d4e5-f6a1c3d47890', 'Geography', 'GEO101', NOW()),
('e5f6a1b2-d4e5-7890-e5f6-a1b2d4e57890', 'Physical Education', 'PE101', NOW()),
('f6a1b2c3-e5f6-7890-f6a1-b2c3e5f67890', 'Art', 'ART101', NOW()),
('a1b2c3d4-f6a1-8901-a1b2-c3d4f6a18901', 'Music', 'MUS101', NOW());

-- Insert sample grades
-- Using direct IDs from previous script
INSERT INTO grades (id, student_id, subject_id, teacher_id, score, term, academic_year, comment, created_at)
VALUES
('b2c3d4e5-a1b2-8901-b2c3-d4e5a1b28901', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'f6a1b2c3-d4e5-7890-f6a1-b2c3d4e57890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 85, 'Term 1', '2023-2024', 'Good work on algebra', NOW()),
('c3d4e5f6-b2c3-8901-c3d4-e5f6b2c38901', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'a1b2c3d4-f6a1-7890-a1b2-c3d4f6a17890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 78, 'Term 1', '2023-2024', 'Needs to work on grammar', NOW()),
('d4e5f6a1-c3d4-8901-d4e5-f6a1c3d48901', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'b2c3d4e5-a1b2-7890-b2c3-d4e5a1b27890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 92, 'Term 1', '2023-2024', 'Excellent understanding of biology concepts', NOW()),
('e5f6a1b2-d4e5-8901-e5f6-a1b2d4e58901', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'c3d4e5f6-b2c3-7890-c3d4-e5f6b2c37890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 88, 'Term 1', '2023-2024', 'Good historical analysis', NOW());

-- Insert sample feedback
INSERT INTO feedback (id, student_id, teacher_id, content, date, created_at)
VALUES
('f6a1b2c3-e5f6-8901-f6a1-b2c3e5f68901', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 'Showing great improvement in class participation', '2024-04-10', NOW()),
('a1b2c3d4-f6a1-9012-a1b2-c3d4f6a19012', 'e5f6a1b2-c3d4-7890-e5f6-a1b2c3d47890', 'b2c3d4e5-f6a1-7890-b2c3-d4e5f6a17890', 'Completed all homework assignments this week', '2024-04-03', NOW()); 