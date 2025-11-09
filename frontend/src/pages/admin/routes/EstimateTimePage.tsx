import React from 'react';
import BackButton from '../../../components/BackButton';

export const EstimateTimePage: React.FC = () => {
  return (
    <div className="p-6">
            <BackButton />
      <h2 className="text-2xl font-bold mb-4">Įvertinti Kelionės Laiką</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Šiame puslapyje bus įrankis, skirtas apskaičiuoti kelionės trukmę pagal pasirinktus maršrutus ir transporto priemones.</p>
        {/* Cia bus tas sunki funkcija*/}
      </div>
    </div>
  );
};
