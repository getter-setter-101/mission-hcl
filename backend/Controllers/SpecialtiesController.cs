using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorAppointmentAPI.Data;
using DoctorAppointmentAPI.DTOs;

namespace DoctorAppointmentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecialtiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecialtiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/specialties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialtyDto>>> GetSpecialties()
        {
            var specialties = await _context.Specialties
                .Select(s => new SpecialtyDto
                {
                    SpecialtyId = s.SpecialtyId,
                    SpecialtyName = s.SpecialtyName
                })
                .ToListAsync();

            return Ok(specialties);
        }

        // GET /api/specialties/{id}/doctors?mode=Online
        [HttpGet("{id}/doctors")]
        public async Task<ActionResult<IEnumerable<DoctorListDto>>> GetDoctorsBySpecialty(
            int id, [FromQuery] string? mode)
        {
            var query = _context.Doctors
                .Include(d => d.Specialty)
                .Where(d => d.SpecialtyId == id);

            // Filter by mode if provided (Issue #3 — Mode mismatch prevention)
            if (!string.IsNullOrEmpty(mode))
            {
                query = query.Where(d => d.Mode == mode);
            }

            var doctors = await query
                .Select(d => new DoctorListDto
                {
                    DoctorId = d.DoctorId,
                    DoctorName = d.DoctorName,
                    SpecialtyName = d.Specialty.SpecialtyName,
                    Experience = d.Experience,
                    Fees = d.Fees,
                    Mode = d.Mode
                })
                .ToListAsync();

            return Ok(doctors);
        }
    }
}
