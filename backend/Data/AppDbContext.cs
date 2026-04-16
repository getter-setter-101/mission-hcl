using Microsoft.EntityFrameworkCore;
using DoctorAppointmentAPI.Models;

namespace DoctorAppointmentAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Specialty> Specialties { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.FullName).HasMaxLength(100).IsRequired();
                entity.Property(u => u.Email).HasMaxLength(100).IsRequired();
                entity.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
                entity.Property(u => u.Phone).HasMaxLength(15);
                entity.Property(u => u.Role).HasMaxLength(20).HasDefaultValue("Patient");
            });

            // Specialty
            modelBuilder.Entity<Specialty>(entity =>
            {
                entity.HasKey(s => s.SpecialtyId);
                entity.Property(s => s.SpecialtyName).HasMaxLength(100).IsRequired();
            });

            // Doctor
            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.HasKey(d => d.DoctorId);
                entity.Property(d => d.DoctorName).HasMaxLength(100).IsRequired();
                entity.Property(d => d.Mode).HasMaxLength(10).IsRequired();
                entity.Property(d => d.Fees).HasColumnType("decimal(10,2)");
                entity.Property(d => d.Email).HasMaxLength(100);

                entity.HasOne(d => d.Specialty)
                      .WithMany(s => s.Doctors)
                      .HasForeignKey(d => d.SpecialtyId);
            });

            // Slot
            modelBuilder.Entity<Slot>(entity =>
            {
                entity.HasKey(s => s.SlotId);
                entity.Property(s => s.IsBooked).HasDefaultValue(false);

                // Unique constraint: prevents duplicate slot creation (Issue #9)
                entity.HasIndex(s => new { s.DoctorId, s.SlotDate, s.StartTime }).IsUnique();

                entity.HasOne(s => s.Doctor)
                      .WithMany(d => d.Slots)
                      .HasForeignKey(s => s.DoctorId);
            });

            // Appointment
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(a => a.AppointmentId);
                entity.Property(a => a.Mode).HasMaxLength(10).IsRequired();
                entity.Property(a => a.Status).HasMaxLength(20).HasDefaultValue("Confirmed");
                entity.Property(a => a.MeetingLink).HasMaxLength(300);
                entity.Property(a => a.ClinicAddress).HasMaxLength(500);

                entity.HasOne(a => a.User)
                      .WithMany(u => u.Appointments)
                      .HasForeignKey(a => a.UserId);

                entity.HasOne(a => a.Doctor)
                      .WithMany(d => d.Appointments)
                      .HasForeignKey(a => a.DoctorId);

                entity.HasOne(a => a.Slot)
                      .WithMany()
                      .HasForeignKey(a => a.SlotId);
            });

            // Seed Specialties
            modelBuilder.Entity<Specialty>().HasData(
                new Specialty { SpecialtyId = 1, SpecialtyName = "Cardiology" },
                new Specialty { SpecialtyId = 2, SpecialtyName = "Dermatology" },
                new Specialty { SpecialtyId = 3, SpecialtyName = "Pediatrics" },
                new Specialty { SpecialtyId = 4, SpecialtyName = "Orthopedics" },
                new Specialty { SpecialtyId = 5, SpecialtyName = "Neurology" }
            );

            // Seed Doctors
            modelBuilder.Entity<Doctor>().HasData(
                new Doctor { DoctorId = 1, DoctorName = "Anjali Sharma", SpecialtyId = 1, Experience = 12, Fees = 800m, Mode = "Online", Email = "anjali@clinic.com" },
                new Doctor { DoctorId = 2, DoctorName = "Rajesh Patel", SpecialtyId = 1, Experience = 8, Fees = 600m, Mode = "Offline", Email = "rajesh@clinic.com" },
                new Doctor { DoctorId = 3, DoctorName = "Priya Gupta", SpecialtyId = 2, Experience = 10, Fees = 700m, Mode = "Online", Email = "priya@clinic.com" },
                new Doctor { DoctorId = 4, DoctorName = "Vikram Singh", SpecialtyId = 2, Experience = 6, Fees = 500m, Mode = "Offline", Email = "vikram@clinic.com" },
                new Doctor { DoctorId = 5, DoctorName = "Sneha Reddy", SpecialtyId = 3, Experience = 15, Fees = 900m, Mode = "Online", Email = "sneha@clinic.com" },
                new Doctor { DoctorId = 6, DoctorName = "Arjun Nair", SpecialtyId = 3, Experience = 5, Fees = 450m, Mode = "Offline", Email = "arjun@clinic.com" },
                new Doctor { DoctorId = 7, DoctorName = "Meena Iyer", SpecialtyId = 4, Experience = 9, Fees = 750m, Mode = "Online", Email = "meena@clinic.com" },
                new Doctor { DoctorId = 8, DoctorName = "Kiran Das", SpecialtyId = 4, Experience = 11, Fees = 650m, Mode = "Offline", Email = "kiran@clinic.com" },
                new Doctor { DoctorId = 9, DoctorName = "Rohit Kumar", SpecialtyId = 5, Experience = 14, Fees = 1000m, Mode = "Online", Email = "rohit@clinic.com" },
                new Doctor { DoctorId = 10, DoctorName = "Divya Menon", SpecialtyId = 5, Experience = 7, Fees = 550m, Mode = "Offline", Email = "divya@clinic.com" }
            );
        }
    }
}
