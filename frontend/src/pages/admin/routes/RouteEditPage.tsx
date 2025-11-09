import React from 'react';
import BackButton from '../../../components/BackButton';

export const RouteEditPage: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Maršruto Redagavimas</h2>
      <p>Čia bus interaktyvus įrankis, leidžiantis  modifikuoti kelionių maršrutus, pridėti taškus ir keisti eiliškumą.</p>
      {/* Interactive map editor would go here */}
    </div>
  );
};
