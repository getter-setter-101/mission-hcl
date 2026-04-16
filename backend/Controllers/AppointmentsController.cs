using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorAppointmentAPI.Data;
using DoctorAppointmentAPI.DTOs;
using DoctorAppointmentAPI.Models;

namespace DoctorAppointmentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Valid status transitions (Issue #8)
        private static readonly Dictionary<string, List<string>> ValidTransitions = new()
        {
            { "Confirmed", new List<string> { "Completed", "Cancelled", "NoShow" } },
            { "Completed", new List<string>() },
            { "Cancelled", new List<string>() },
            { "NoShow", new List<string>() }
        };

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/appointments
        [HttpPost]
        public async Task<ActionResult<AppointmentResponseDto>> BookAppointment(
            [FromBody] BookingRequestDto request)
        {
            // Use a transaction to prevent double booking (Issue #1)
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validate doctor exists
                var doctor = await _context.Doctors
                    .Include(d => d.Specialty)
                    .FirstOrDefaultAsync(d => d.DoctorId == request.DoctorId);

                if (doctor == null)
                    return NotFound(new { message = "Doctor not found." });

                // Validate slot exists and belongs to this doctor
                var slot = await _context.Slots
                    .FirstOrDefaultAsync(s => s.SlotId == request.SlotId && s.DoctorId == request.DoctorId);

                if (slot == null)
                    return NotFound(new { message = "Slot not found." });

                // Issue #4 — Re-check slot availability inside transaction (stale data)
                if (slot.IsBooked)
                    return Conflict(new { message = "This slot was just booked by another patient. Please select a different slot." });

                // Issue #7 — Reject expired slots
                var slotDateTime = slot.SlotDate.ToDateTime(slot.StartTime);
                if (slotDateTime <= DateTime.Now)
                    return BadRequest(new { message = "This slot has expired. Please select a future time slot." });

                // Issue #5 — Duplicate booking check
                var duplicate = await _context.Appointments
                    .AnyAsync(a =>
                        a.UserId == request.UserId &&
                        a.DoctorId == request.DoctorId &&
                        a.Slot.SlotDate == slot.SlotDate &&
                        a.Status == "Confirmed");

                if (duplicate)
                    return Conflict(new { message = "You already have an active appointment with this doctor on this date." });

                // Lock the slot (Issue #1)
                slot.IsBooked = true;

                // Generate mode-specific details
                string? meetingLink = null;
                string? clinicAddress = null;

                if (doctor.Mode == "Online")
                {
                    meetingLink = $"https://meet.clinic.com/apt-{Guid.NewGuid().ToString("N")[..12]}";
                }
                else
                {
                    clinicAddress = "Main Clinic, Ground Floor, City Hospital";
                }

                // Create appointment
                var appointment = new Appointment
                {
                    UserId = request.UserId,
                    DoctorId = request.DoctorId,
                    SlotId = request.SlotId,
                    Mode = doctor.Mode,
                    Status = "Confirmed",
                    BookingDate = DateTime.UtcNow,
                    MeetingLink = meetingLink,
                    ClinicAddress = clinicAddress
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return response
                var response = new AppointmentResponseDto
                {
                    AppointmentId = appointment.AppointmentId,
                    UserId = appointment.UserId,
                    DoctorId = appointment.DoctorId,
                    DoctorName = doctor.DoctorName,
                    SpecialtyName = doctor.Specialty.SpecialtyName,
                    SlotId = appointment.SlotId,
                    SlotDate = slot.SlotDate,
                    StartTime = slot.StartTime,
                    EndTime = slot.EndTime,
                    Mode = appointment.Mode,
                    Status = appointment.Status,
                    BookingDate = appointment.BookingDate,
                    Fees = doctor.Fees,
                    MeetingLink = appointment.MeetingLink,
                    ClinicAddress = appointment.ClinicAddress
                };

                return CreatedAtAction(nameof(GetUserAppointments), new { userId = appointment.UserId }, response);
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while booking the appointment." });
            }
        }

        // GET /api/users/{userId}/appointments
        [HttpGet("/api/users/{userId}/appointments")]
        public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetUserAppointments(int userId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.Specialty)
                .Include(a => a.Slot)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.BookingDate)
                .Select(a => new AppointmentResponseDto
                {
                    AppointmentId = a.AppointmentId,
                    UserId = a.UserId,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.DoctorName,
                    SpecialtyName = a.Doctor.Specialty.SpecialtyName,
                    SlotId = a.SlotId,
                    SlotDate = a.Slot.SlotDate,
                    StartTime = a.Slot.StartTime,
                    EndTime = a.Slot.EndTime,
                    Mode = a.Mode,
                    Status = a.Status,
                    BookingDate = a.BookingDate,
                    Fees = a.Doctor.Fees,
                    MeetingLink = a.MeetingLink,
                    ClinicAddress = a.ClinicAddress
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // PUT /api/appointments/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Slot)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            // Issue #8 — Validate status transition
            if (!ValidTransitions.ContainsKey(appointment.Status) ||
                !ValidTransitions[appointment.Status].Contains(dto.Status))
            {
                return BadRequest(new { message = $"Invalid transition: cannot change from {appointment.Status} to {dto.Status}." });
            }

            // Issue #6 — If cancelling, release the slot in the same transaction
            if (dto.Status == "Cancelled")
            {
                var slot = appointment.Slot;
                if (slot != null)
                {
                    slot.IsBooked = false;
                }
            }

            appointment.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Appointment status updated to {dto.Status}." });
        }
    }
}
