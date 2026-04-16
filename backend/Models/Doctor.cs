namespace DoctorAppointmentAPI.Models
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public int SpecialtyId { get; set; }
        public int Experience { get; set; }
        public decimal Fees { get; set; }
        public string Mode { get; set; } = string.Empty; // "Online" or "Offline"
        public string? Email { get; set; }

        // Navigation
        public Specialty Specialty { get; set; } = null!;
        public ICollection<Slot> Slots { get; set; } = new List<Slot>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
