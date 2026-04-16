namespace DoctorAppointmentAPI.DTOs
{
    public class BookingRequestDto
    {
        public int UserId { get; set; }
        public int DoctorId { get; set; }
        public int SlotId { get; set; }
    }
}
