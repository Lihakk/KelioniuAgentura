using Microsoft.EntityFrameworkCore;
using backend.Entities;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<PointOfInterest> PointsOfInterest { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<backend.Entities.Route> Routes { get; set; }
        public DbSet<Transport> Transports { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Traveler> Travelers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<UserPreferences> UserPreferences { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<User>()
                .Property(e => e.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Reservation>()
                .Property(e => e.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(e => e.Status)
                .HasConversion<string>();


            modelBuilder.Entity<Hotel>().Property(h => h.PricePerNight).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Trip>().Property(t => t.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Reservation>().Property(r => r.TotalAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Payment>().Property(p => p.Amount).HasColumnType("decimal(18,2)");

            // 1. User -> Reservations
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reservations)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            //  City -> Hotels & POIs
            modelBuilder.Entity<City>()
                .HasMany(c => c.Hotels)
                .WithOne(h => h.City)
                .HasForeignKey(h => h.CityId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<City>()
                .HasMany(c => c.PointsOfInterest)
                .WithOne(p => p.City)
                .HasForeignKey(p => p.CityId)
                .OnDelete(DeleteBehavior.Cascade);

            // 3. Route -> Trips
            modelBuilder.Entity<backend.Entities.Route>()
                .HasMany(r => r.Trips)
                .WithOne(t => t.Route)
                .HasForeignKey(t => t.RouteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Route -> Transports & Stops
            modelBuilder.Entity<backend.Entities.Route>()
                .HasMany(r => r.Transports)
                .WithOne(t => t.Route)
                .HasForeignKey(t => t.RouteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<backend.Entities.Route>()
                .HasMany(r => r.Stops)
                .WithOne(p => p.Route)
                .HasForeignKey(p => p.RouteId);

            //  Reservation -> Payment (1-to-1)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Payment)
                .WithOne(p => p.Reservation)
                .HasForeignKey<Payment>(p => p.ReservationId)
                .OnDelete(DeleteBehavior.Cascade); 

            //  Reservation -> Travelers
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Travelers)
                .WithOne(t => t.Reservation)
                .HasForeignKey(t => t.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "System",
                    Username = "admin",
                    Email = "admin@travel.com",
                    PasswordHash = "admin123",
                    Role = UserRole.Administrator,
                    IsConfirmed = true,
                }
            );

             modelBuilder.Entity<UserPreferences>(entity =>
                {
                    entity.ToTable("UserPreferences");
                    entity.HasKey(e => e.Id);
                    
                    entity.HasOne(e => e.User)
                        .WithMany()
                        .HasForeignKey(e => e.UserId)
                        .OnDelete(DeleteBehavior.Cascade);
                    
                    entity.HasIndex(e => e.UserId).IsUnique();
                    
                    entity.Property(e => e.BudgetMin)
                        .HasColumnType("decimal(18,2)");
                    
                    entity.Property(e => e.BudgetMax)
                        .HasColumnType("decimal(18,2)");
                });
        }
    }
}