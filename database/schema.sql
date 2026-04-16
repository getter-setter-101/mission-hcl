-- ============================================
-- Doctor Appointment Booking System - Schema
-- Database: MySQL
-- ============================================

-- USERS
CREATE TABLE Users (
   UserId INT PRIMARY KEY AUTO_INCREMENT,
   FullName VARCHAR(100) NOT NULL,
   Email VARCHAR(100) UNIQUE NOT NULL,
   PasswordHash VARCHAR(255) NOT NULL,
   Phone VARCHAR(15),
   Role VARCHAR(20) DEFAULT 'Patient',
   CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SPECIALTIES
CREATE TABLE Specialties (
   SpecialtyId INT PRIMARY KEY AUTO_INCREMENT,
   SpecialtyName VARCHAR(100) NOT NULL
);

-- DOCTORS
CREATE TABLE Doctors (
   DoctorId INT PRIMARY KEY AUTO_INCREMENT,
   DoctorName VARCHAR(100) NOT NULL,
   SpecialtyId INT NOT NULL,
   Experience INT DEFAULT 0,
   Fees DECIMAL(10,2) DEFAULT 0.00,
   Mode VARCHAR(10) NOT NULL CHECK (Mode IN ('Online', 'Offline')),
   Email VARCHAR(100),
   FOREIGN KEY (SpecialtyId) REFERENCES Specialties(SpecialtyId)
);

-- SLOTS
CREATE TABLE Slots (
   SlotId INT PRIMARY KEY AUTO_INCREMENT,
   DoctorId INT NOT NULL,
   SlotDate DATE NOT NULL,
   StartTime TIME NOT NULL,
   EndTime TIME NOT NULL,
   IsBooked BOOLEAN DEFAULT FALSE,
   UNIQUE(DoctorId, SlotDate, StartTime),
   FOREIGN KEY (DoctorId) REFERENCES Doctors(DoctorId)
);

-- APPOINTMENTS
CREATE TABLE Appointments (
   AppointmentId INT PRIMARY KEY AUTO_INCREMENT,
   UserId INT NOT NULL,
   DoctorId INT NOT NULL,
   SlotId INT NOT NULL,
   Mode VARCHAR(10) NOT NULL CHECK (Mode IN ('Online', 'Offline')),
   Status VARCHAR(20) DEFAULT 'Confirmed' CHECK (Status IN ('Confirmed', 'Completed', 'Cancelled', 'NoShow')),
   BookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
   MeetingLink VARCHAR(300),
   ClinicAddress VARCHAR(500),
   FOREIGN KEY (UserId) REFERENCES Users(UserId),
   FOREIGN KEY (DoctorId) REFERENCES Doctors(DoctorId),
   FOREIGN KEY (SlotId) REFERENCES Slots(SlotId)
);
