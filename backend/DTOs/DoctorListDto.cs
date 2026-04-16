namespace DoctorAppointmentAPI.DTOs
{
    public class DoctorListDto
    {
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string SpecialtyName { get; set; } = string.Empty;
        public int Experience { get; set; }
        public decimal Fees { get; set; }
        public string Mode { get; set; } = string.Empty;
    }
}
