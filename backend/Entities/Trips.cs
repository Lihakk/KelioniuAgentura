using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public class Route
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DurationDays { get; set; }
        public double DistanceKm { get; set; }
        public string Season { get; set; }

        public List<PointOfInterest> Stops { get; set; } = new List<PointOfInterest>();
        public List<Transport> Transports { get; set; } = new List<Transport>();
        public List<Trip> Trips { get; set; } = new List<Trip>();
    }

    public class Transport
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Provider { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int SeatCount { get; set; }
        
        public int RouteId { get; set; }
        public Route Route { get; set; }
    }

    public class Trip
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }

        public int RouteId { get; set; }
        public Route Route { get; set; }

        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}