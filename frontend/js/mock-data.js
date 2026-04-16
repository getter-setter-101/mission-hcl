// =============================================
// MOCK DATA — mirrors the backend schema
// =============================================

const MOCK_SPECIALTIES = [
  { specialtyId: 1, specialtyName: "Cardiology" },
  { specialtyId: 2, specialtyName: "Dermatology" },
  { specialtyId: 3, specialtyName: "Pediatrics" },
  { specialtyId: 4, specialtyName: "Orthopedics" },
  { specialtyId: 5, specialtyName: "Neurology" },
];

const MOCK_DOCTORS = [
  { doctorId: 1, doctorName: "Anjali Sharma", specialtyId: 1, experience: 12, fees: 800, mode: "Online", email: "anjali@clinic.com" },
  { doctorId: 2, doctorName: "Rajesh Patel", specialtyId: 1, experience: 8, fees: 600, mode: "Offline", email: "rajesh@clinic.com" },
  { doctorId: 3, doctorName: "Priya Gupta", specialtyId: 2, experience: 10, fees: 700, mode: "Online", email: "priya@clinic.com" },
  { doctorId: 4, doctorName: "Vikram Singh", specialtyId: 2, experience: 6, fees: 500, mode: "Offline", email: "vikram@clinic.com" },
  { doctorId: 5, doctorName: "Sneha Reddy", specialtyId: 3, experience: 15, fees: 900, mode: "Online", email: "sneha@clinic.com" },
  { doctorId: 6, doctorName: "Arjun Nair", specialtyId: 3, experience: 5, fees: 450, mode: "Offline", email: "arjun@clinic.com" },
  { doctorId: 7, doctorName: "Meena Iyer", specialtyId: 4, experience: 9, fees: 750, mode: "Online", email: "meena@clinic.com" },
  { doctorId: 8, doctorName: "Kiran Das", specialtyId: 4, experience: 11, fees: 650, mode: "Offline", email: "kiran@clinic.com" },
  { doctorId: 9, doctorName: "Rohit Kumar", specialtyId: 5, experience: 14, fees: 1000, mode: "Online", email: "rohit@clinic.com" },
  { doctorId: 10, doctorName: "Divya Menon", specialtyId: 5, experience: 7, fees: 550, mode: "Offline", email: "divya@clinic.com" },
];

// Generate slots for each doctor for the next 7 days
function generateMockSlots() {
  const slots = [];
  let slotId = 1;
  const timeSlots = [
    { start: "09:00", end: "09:30" },
    { start: "09:30", end: "10:00" },
    { start: "10:00", end: "10:30" },
    { start: "10:30", end: "11:00" },
    { start: "11:00", end: "11:30" },
    { start: "14:00", end: "14:30" },
    { start: "14:30", end: "15:00" },
    { start: "15:00", end: "15:30" },
  ];

  MOCK_DOCTORS.forEach((doc) => {
    for (let d = 0; d < 7; d++) {
      const date = new Date();
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().split("T")[0];

      timeSlots.forEach((ts) => {
        slots.push({
          slotId: slotId++,
          doctorId: doc.doctorId,
          slotDate: dateStr,
          startTime: ts.start,
          endTime: ts.end,
          isBooked: Math.random() < 0.25, // ~25% already booked
        });
      });
    }
  });
  return slots;
}

const MOCK_SLOTS = generateMockSlots();

// Appointments store (simulates the Appointments table)
const MOCK_APPOINTMENTS = [];
let appointmentIdCounter = 1;

const MOCK_CLINIC_ADDRESSES = {
  2: "Room 204, City Hospital, MG Road, Mumbai",
  4: "Ground Floor, Skin Care Center, Park Street, Kolkata",
  6: "Block B, Children's Wing, Apollo Clinic, Hyderabad",
  8: "Suite 12, Ortho Center, Connaught Place, Delhi",
  10: "1st Floor, NeuroLife Clinic, Anna Nagar, Chennai",
};

// Valid status transitions (Issue #8)
const VALID_TRANSITIONS = {
  Confirmed: ["Completed", "Cancelled", "NoShow"],
  Completed: [],
  Cancelled: [],
  NoShow: [],
};
