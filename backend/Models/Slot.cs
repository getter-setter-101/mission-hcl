namespace DoctorAppointmentAPI.Models
{
    public class Slot
    {
        public int SlotId { get; set; }
        public int DoctorId { get; set; }
        public DateOnly SlotDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public bool IsBooked { get; set; } = false;

        // Navigation
        public Doctor Doctor { get; set; } = null!;
    }
}
