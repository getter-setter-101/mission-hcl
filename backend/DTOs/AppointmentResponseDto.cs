namespace DoctorAppointmentAPI.DTOs
{
    public class AppointmentResponseDto
    {
        public int AppointmentId { get; set; }
        public int UserId { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string SpecialtyName { get; set; } = string.Empty;
        public int SlotId { get; set; }
        public DateOnly SlotDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string Mode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public decimal Fees { get; set; }
        public string? MeetingLink { get; set; }
        public string? ClinicAddress { get; set; }
    }
}
