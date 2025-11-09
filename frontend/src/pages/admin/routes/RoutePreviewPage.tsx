import React from 'react';
import BackButton from '../../../components/BackButton';

export const RoutePreviewPage: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Maršruto Peržiūra</h2>
      <p>Čia bus rodomas detalus pasirinktos kelionės maršrutas.</p>
      {/* Map component and route details would go here */}
    </div>
  );
};
