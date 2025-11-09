import React from 'react';
import { Link } from 'react-router-dom';

const featuredTrips = [
  {
    id: 'maldives',
    destination: 'Maldyvų Rojus',
    price: 'nuo €1,200',
    imageUrl: 'https://images.unsplash.com/photo-1540202404-de3a40417b35',
  },
  {
    id: 'alps',
    destination: 'Alpių Nuotykis',
    price: 'nuo €850',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  {
    id: 'rome',
    destination: 'Senovės Roma',
    price: 'nuo €600',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
  },
];

const TripCard: React.FC<typeof featuredTrips[0]> = ({ id, destination, price, imageUrl }) => {
  return (
    <Link to={`/trip/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img src={imageUrl} alt={destination} className="w-full h-56 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">{destination}</h3>
          <p className="text-md text-gray-600 mt-1">{price}</p>
        </div>
      </div>
    </Link>
  );
};

export const MainPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4">Atraskite Savo Svajonių Kelionę</h1>
          <p className="text-lg">Planuokite nepamirštamas atostogas su mumis.</p>
        </div>
      </header>

      {/* Featured Trips Section */}
      <main className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Populiariausios Kelionės</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredTrips.map(trip => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
