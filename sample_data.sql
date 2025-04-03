-- Insert Sample Subjects
INSERT INTO subjects (id, name, code, created_at)
VALUES 
(UUID(), 'Mathematics', 'MATH101', NOW()),
(UUID(), 'English', 'ENG101', NOW()),
(UUID(), 'Science', 'SCI101', NOW()),
(UUID(), 'History', 'HIST101', NOW()),
(UUID(), 'Geography', 'GEO101', NOW()),
(UUID(), 'Physical Education', 'PE101', NOW()),
(UUID(), 'Art', 'ART101', NOW()),
(UUID(), 'Music', 'MUS101', NOW());

-- Get IDs for reference
SELECT id INTO @mathId FROM subjects WHERE code = 'MATH101' LIMIT 1;
SELECT id INTO @engId FROM subjects WHERE code = 'ENG101' LIMIT 1;
SELECT id INTO @sciId FROM subjects WHERE code = 'SCI101' LIMIT 1;
SELECT id INTO @histId FROM subjects WHERE code = 'HIST101' LIMIT 1;

-- Get student ID
SELECT id INTO @studentId FROM students LIMIT 1;

-- Get teacher ID
SELECT user_id INTO @teacherId FROM teachers LIMIT 1;

-- Insert sample grades
INSERT INTO grades (id, student_id, subject_id, teacher_id, score, term, academic_year, comment, created_at)
VALUES
(UUID(), @studentId, @mathId, @teacherId, 85, 'Term 1', '2023-2024', 'Good work on algebra', NOW()),
(UUID(), @studentId, @engId, @teacherId, 78, 'Term 1', '2023-2024', 'Needs to work on grammar', NOW()),
(UUID(), @studentId, @sciId, @teacherId, 92, 'Term 1', '2023-2024', 'Excellent understanding of biology concepts', NOW()),
(UUID(), @studentId, @histId, @teacherId, 88, 'Term 1', '2023-2024', 'Good historical analysis', NOW());

-- Insert sample feedback
INSERT INTO feedback (id, student_id, teacher_id, content, date, created_at)
VALUES
(UUID(), @studentId, @teacherId, 'Showing great improvement in class participation', CURRENT_DATE(), NOW()),
(UUID(), @studentId, @teacherId, 'Completed all homework assignments this week', DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), '%Y-%m-%d'), NOW()); 