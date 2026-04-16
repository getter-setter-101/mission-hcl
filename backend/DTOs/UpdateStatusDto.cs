namespace DoctorAppointmentAPI.DTOs
{
    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty; // Completed | Cancelled | NoShow
    }
}
