import React from 'react';

export const StripeCheckoutPage: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Ruošiamas saugus mokėjimas...</h1>
      <p className="text-gray-600">Jūs būsite nukreipti į Stripe apmokėjimo puslapį.</p>
      {/* Stipre SDK redirectas cia bus */}
    </div>
  );
};
