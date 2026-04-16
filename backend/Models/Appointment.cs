namespace DoctorAppointmentAPI.Models
{
    public class Appointment
    {
        public int AppointmentId { get; set; }
        public int UserId { get; set; }
        public int DoctorId { get; set; }
        public int SlotId { get; set; }
        public string Mode { get; set; } = string.Empty; // "Online" or "Offline"
        public string Status { get; set; } = "Confirmed"; // Confirmed | Completed | Cancelled | NoShow
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public string? MeetingLink { get; set; }
        public string? ClinicAddress { get; set; }

        // Navigation
        public User User { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
        public Slot Slot { get; set; } = null!;
    }
}
