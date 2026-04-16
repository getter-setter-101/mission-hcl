namespace DoctorAppointmentAPI.Models
{
    public class Specialty
    {
        public int SpecialtyId { get; set; }
        public string SpecialtyName { get; set; } = string.Empty;

        // Navigation: One specialty has many doctors
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}
