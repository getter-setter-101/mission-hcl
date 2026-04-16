# Doctor Appointment Booking System

A complete booking system where patients can browse medical specialties, view doctors, check available time slots, and book appointments in **Online** (teleconsultation) or **Offline** (in-clinic) mode.

## Project Structure

```
Mission HCL/
├── frontend/                  # Client-side UI
│   ├── index.html             # Main HTML (8 screens)
│   ├── css/
│   │   └── styles.css         # Stylesheet
│   └── js/
│       ├── mock-data.js       # Mock data layer (mirrors backend schema)
│       ├── utils.js           # Utility functions (formatDate, isSlotPast, toast)
│       └── app.js             # App logic (navigation, auth, booking, appointments)
│
├── backend/                   # ASP.NET Core Web API
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Specialty.cs
│   │   ├── Doctor.cs
│   │   ├── Slot.cs
│   │   └── Appointment.cs
│   ├── DTOs/
│   │   ├── SpecialtyDto.cs
│   │   ├── DoctorListDto.cs
│   │   ├── SlotDto.cs
│   │   ├── BookingRequestDto.cs
│   │   ├── AppointmentResponseDto.cs
│   │   └── UpdateStatusDto.cs
│   ├── Controllers/
│   │   ├── SpecialtiesController.cs
│   │   ├── DoctorsController.cs
│   │   └── AppointmentsController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── database/                  # SQL scripts
│   ├── schema.sql             # Table definitions
│   └── seed-data.sql          # Sample data
│
└── README.md
```

## Running the Frontend

```bash
cd frontend
npx -y http-server . -p 8080 -c-1
```

Open http://localhost:8080 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/specialties` | List all specialties |
| GET | `/api/specialties/{id}/doctors?mode=Online` | Doctors by specialty and mode |
| GET | `/api/doctors/{id}` | Doctor details |
| GET | `/api/doctors/{id}/slots?date=2026-04-17` | Available slots for a doctor |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/users/{userId}/appointments` | User's booking history |
| PUT | `/api/appointments/{id}/status` | Update appointment status |

## Backend Setup (ASP.NET Core + MySQL)

```bash
cd backend
dotnet add package MySql.EntityFrameworkCore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

Update the connection string in `appsettings.json` before running.

## Use Cases

| # | Use Case | Description |
|---|----------|-------------|
| UC-1 | Browse & Filter | Browse specialties, filter doctors by mode |
| UC-2 | View Slots | View available slots by doctor and date |
| UC-3 | Book Appointment | Select slot, confirm, receive mode-specific details |
| UC-4 | My Appointments | View booking history with status |
| UC-5 | Update Status | Mark as Completed / NoShow |
| UC-6 | Cancel | Cancel appointment and release slot |

## Edge Cases Handled

| Issue | Solution |
|-------|----------|
| Double Booking | IsBooked flag + transactional locking |
| Mode Mismatch | Doctor.Mode validation at filter and booking time |
| Stale Slot Data | Re-check inside transaction before confirming |
| Duplicate Booking | Check existing active appointment for same doctor+date |
| Cancelled Slot Not Released | Atomic cancel + slot release in one transaction |
| Expired Slot Bookable | Full date+time comparison to filter expired slots |
| Invalid Status Transition | Enforced transition map (Confirmed → Completed/Cancelled/NoShow) |
| Duplicate Slot Creation | UNIQUE constraint on (DoctorId, SlotDate, StartTime) |

## Booking Flow

```
Login → Mode (Online/Offline) → Specialty → Doctor → Slots → Confirm → Success
```
