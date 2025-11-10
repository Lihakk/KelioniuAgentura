import React from 'react';
import { Link, useParams } from 'react-router-dom';

// Cia imsim is db
const sampleTripData = {
  '1': {
    destination: 'Kelionė į Graikiją',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740',
    route: 'Atėnai -> Santorini -> Kreta. Atraskite senovės istoriją ir mėgaukitės nuostabiais paplūdimiais.',
  },
  '2': {
    destination: 'Savaitgalis Paryžiuje',
    imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    route: 'Aplankykite Eifelio bokštą, Luvro muziejų ir Monmartro rajoną. Romantiškas pabėgimas garantuotas.',
  },
  'maldives': {
    destination: 'Maldyvų Rojus',
    imageUrl: 'https://images.unsplash.com/photo-1540202404-de3a40417b35',
    route: 'Atsipalaiduokite privačiame namelyje ant vandens, mėgaukitės krištolo skaidrumo vandeniu ir balto smėlio paplūdimiais. Tai tikras rojus žemėje.',
  },
  'alps': {
    destination: 'Alpių Nuotykis',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    route: 'Keliaukite po didingus Alpių kalnus, slidinėkite geriausiomis trasomis ir mėgaukitės kvapą gniaužiančiais gamtos vaizdais.',
  },
  'rome': {
    destination: 'Senovės Roma',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    route: 'Pasinerkite į istoriją aplankydami Koliziejų, Romos forumą ir Vatikaną. Paragaukite autentiškos itališkos virtuvės patiekalų.',
  },
};

type TripKey = keyof typeof sampleTripData;

export const TripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: TripKey }>();
  
  if (!tripId || !sampleTripData[tripId]) {
    return <div className="p-8 text-center text-xl">Atsiprašome, ši kelionė nerasta.</div>;
  }

  const trip = sampleTripData[tripId];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-4">{trip.destination}</h1>
      <img src={trip.imageUrl} alt={trip.destination} className="w-full h-[500px] object-cover rounded-lg shadow-2xl mb-8" />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Maršrutas ir Aprašymas</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{trip.route}</p>
        <div className="text-center">
            <Link to={`/rezervation/create`} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg">
                Rezervuoti Dabar
            </Link>
        </div>
      </div>
    </div>
  );
};
