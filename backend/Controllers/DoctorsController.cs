using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorAppointmentAPI.Data;
using DoctorAppointmentAPI.DTOs;

namespace DoctorAppointmentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/doctors/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorListDto>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialty)
                .Where(d => d.DoctorId == id)
                .Select(d => new DoctorListDto
                {
                    DoctorId = d.DoctorId,
                    DoctorName = d.DoctorName,
                    SpecialtyName = d.Specialty.SpecialtyName,
                    Experience = d.Experience,
                    Fees = d.Fees,
                    Mode = d.Mode
                })
                .FirstOrDefaultAsync();

            if (doctor == null)
                return NotFound(new { message = "Doctor not found." });

            return Ok(doctor);
        }

        // GET /api/doctors/{id}/slots?date=2026-04-16
        [HttpGet("{id}/slots")]
        public async Task<ActionResult<IEnumerable<SlotDto>>> GetSlots(
            int id, [FromQuery] string? date)
        {
            var query = _context.Slots.Where(s => s.DoctorId == id);

            // Filter by date if provided
            if (!string.IsNullOrEmpty(date) && DateOnly.TryParse(date, out var parsedDate))
            {
                // Issue #7 — Reject past dates
                if (parsedDate < DateOnly.FromDateTime(DateTime.Today))
                {
                    return BadRequest(new { message = "Cannot view slots for past dates." });
                }

                query = query.Where(s => s.SlotDate == parsedDate);
            }
            else
            {
                // Default: only show today and future slots
                var today = DateOnly.FromDateTime(DateTime.Today);
                query = query.Where(s => s.SlotDate >= today);
            }

            var slots = await query
                .OrderBy(s => s.SlotDate)
                .ThenBy(s => s.StartTime)
                .Select(s => new SlotDto
                {
                    SlotId = s.SlotId,
                    DoctorId = s.DoctorId,
                    SlotDate = s.SlotDate,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    IsBooked = s.IsBooked
                })
                .ToListAsync();

            return Ok(slots);
        }
    }
}
