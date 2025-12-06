using System.Collections.Generic;

namespace backend.Entities
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Coordinates { get; set; }

        public List<Hotel> Hotels { get; set; } = new List<Hotel>();
        public List<PointOfInterest> PointsOfInterest { get; set; } = new List<PointOfInterest>();
    }

    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public int Stars { get; set; }
        public string ContactInfo { get; set; }
        public decimal PricePerNight { get; set; }

        public int CityId { get; set; }
        public City City { get; set; }
    }

    public class PointOfInterest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Address { get; set; }
        public bool IsPaidTicket { get; set; }
        public string OpeningHours { get; set; }
        public double Rating { get; set; }

        public int CityId { get; set; }
        public City City { get; set; }

        public int RouteId { get; set; }
        public Route Route { get; set; }
    }
}