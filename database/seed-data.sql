-- ============================================
-- Doctor Appointment Booking System - Seed Data
-- ============================================

-- SPECIALTIES
INSERT INTO Specialties (SpecialtyName) VALUES
('Cardiology'),
('Dermatology'),
('Pediatrics'),
('Orthopedics'),
('Neurology');

-- DOCTORS (Online and Offline per specialty)
INSERT INTO Doctors (DoctorName, SpecialtyId, Experience, Fees, Mode, Email) VALUES
('Anjali Sharma',  1, 12, 800.00, 'Online',  'anjali@clinic.com'),
('Rajesh Patel',   1,  8, 600.00, 'Offline', 'rajesh@clinic.com'),
('Priya Gupta',    2, 10, 700.00, 'Online',  'priya@clinic.com'),
('Vikram Singh',   2,  6, 500.00, 'Offline', 'vikram@clinic.com'),
('Sneha Reddy',    3, 15, 900.00, 'Online',  'sneha@clinic.com'),
('Arjun Nair',     3,  5, 450.00, 'Offline', 'arjun@clinic.com'),
('Meena Iyer',     4,  9, 750.00, 'Online',  'meena@clinic.com'),
('Kiran Das',      4, 11, 650.00, 'Offline', 'kiran@clinic.com'),
('Rohit Kumar',    5, 14, 1000.00,'Online',  'rohit@clinic.com'),
('Divya Menon',    5,  7, 550.00, 'Offline', 'divya@clinic.com');

-- SAMPLE SLOTS (for Doctor 1 - Anjali Sharma, Online Cardiology)
-- Generate for 2026-04-16 to 2026-04-22
INSERT INTO Slots (DoctorId, SlotDate, StartTime, EndTime) VALUES
(1, '2026-04-16', '09:00:00', '09:30:00'),
(1, '2026-04-16', '09:30:00', '10:00:00'),
(1, '2026-04-16', '10:00:00', '10:30:00'),
(1, '2026-04-16', '10:30:00', '11:00:00'),
(1, '2026-04-16', '11:00:00', '11:30:00'),
(1, '2026-04-16', '14:00:00', '14:30:00'),
(1, '2026-04-16', '14:30:00', '15:00:00'),
(1, '2026-04-16', '15:00:00', '15:30:00'),
(1, '2026-04-17', '09:00:00', '09:30:00'),
(1, '2026-04-17', '09:30:00', '10:00:00'),
(1, '2026-04-17', '10:00:00', '10:30:00'),
(1, '2026-04-17', '10:30:00', '11:00:00'),
(1, '2026-04-17', '11:00:00', '11:30:00'),
(1, '2026-04-17', '14:00:00', '14:30:00'),
(1, '2026-04-17', '14:30:00', '15:00:00'),
(1, '2026-04-17', '15:00:00', '15:30:00');

-- SAMPLE SLOTS (for Doctor 2 - Rajesh Patel, Offline Cardiology)
INSERT INTO Slots (DoctorId, SlotDate, StartTime, EndTime) VALUES
(2, '2026-04-16', '09:00:00', '09:30:00'),
(2, '2026-04-16', '09:30:00', '10:00:00'),
(2, '2026-04-16', '10:00:00', '10:30:00'),
(2, '2026-04-16', '10:30:00', '11:00:00'),
(2, '2026-04-16', '14:00:00', '14:30:00'),
(2, '2026-04-16', '14:30:00', '15:00:00'),
(2, '2026-04-17', '09:00:00', '09:30:00'),
(2, '2026-04-17', '09:30:00', '10:00:00'),
(2, '2026-04-17', '10:00:00', '10:30:00'),
(2, '2026-04-17', '14:00:00', '14:30:00'),
(2, '2026-04-17', '14:30:00', '15:00:00');

-- SAMPLE USER
INSERT INTO Users (FullName, Email, PasswordHash, Phone, Role) VALUES
('Test Patient', 'patient@test.com', '$2a$11$examplehash', '9876543210', 'Patient');
