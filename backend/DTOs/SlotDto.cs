namespace DoctorAppointmentAPI.DTOs
{
    public class SlotDto
    {
        public int SlotId { get; set; }
        public int DoctorId { get; set; }
        public DateOnly SlotDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public bool IsBooked { get; set; }
    }
}
