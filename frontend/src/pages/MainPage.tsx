import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


interface Recommendation {
  tripId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: number;
  routeId: number;
  routeName?: string;
  score: number;
  matchPercentage: number;
  reasons: string[];
  isAdminRecommended?: boolean;
  adminNote?: string;
  adminName?: string;
  availableSpots: number;
  totalSpots: number;
  mainImage?: string;  
}

const TripCard: React.FC<{ rec: Recommendation; isGuest?: boolean }> = ({ rec, isGuest = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const { role } = useAuth();  

  const getImageUrl = () => {
    if (rec.mainImage) {
      return `http://localhost:5050${rec.mainImage}`;
    }
    return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop';
  };

  const getMatchColor = () => {
    if (rec.matchPercentage >= 80) return 'from-green-500 to-emerald-600';
    if (rec.matchPercentage >= 60) return 'from-blue-500 to-indigo-600';
    if (rec.matchPercentage >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={rec.title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop';
          }}
        />
        
        {!isGuest && (
          <div className={`absolute top-3 right-3 bg-gradient-to-r ${getMatchColor()} px-4 py-2 rounded-full shadow-lg`}>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-sm">{rec.matchPercentage}%</span>
            </div>
          </div>
        )}

        {rec.isAdminRecommended && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full shadow-lg">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold text-xs">VIP</span>
            </div>
          </div>
        )}

        {isGuest && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-1 rounded-full shadow-lg">
            <span className="text-white font-semibold text-xs">Populiaru</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{rec.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {rec.description}
        </p>

        {rec.isAdminRecommended && rec.adminNote && (
          <div className="mb-3 p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p className="text-xs text-purple-800 font-medium">{rec.adminNote}</p>
          </div>
        )}

        {rec.reasons.length > 0 && (
          <div className="mb-4 space-y-2">
            {rec.reasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="flex items-start text-sm">
                <svg
                  className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Trukmė</p>
            <p className="text-sm font-bold text-gray-900">{rec.duration}d</p>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Kaina</p>
            <p className="text-lg font-bold text-blue-600">€{rec.price}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Vietos</p>
            <p className="text-sm font-bold text-gray-900">{rec.availableSpots}/{rec.totalSpots}</p>
          </div>
        </div>

        {/* Date */}
        <div className="mb-4 p-2 bg-gray-50 rounded text-center">
          <p className="text-xs text-gray-500">Pradžia</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(rec.startDate)}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/trip/${rec.tripId}`}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center text-sm font-semibold transition-colors"
          >
            Peržiūrėti
          </Link>
          
          {/* ✅ ONLY SHOW IF NOT ADMIN */}
          {role !== 'Administrator' && (
            <Link
              to={isGuest ? '/login' : `/rezervation/create`}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              {isGuest ? 'Prisijungti' : 'Rezervuoti'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


export const MainPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let userId: number | null = null;
      
      try {
        const userResponse = await axios.get('http://localhost:5050/api/User/Me', {
          withCredentials: true,
        });
        userId = userResponse.data.id;
        setIsGuest(false);
      } catch (err) {
        console.log('User not logged in, showing popular trips');
        setIsGuest(true);
      }

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5050/api/recommendations?userId=${userId}&count=6`
          );

          if (response.data.recommendations) {
            setRecommendations(response.data.recommendations);
          } else if (Array.isArray(response.data)) {
            setRecommendations(response.data);
          } else {
            console.error('Unexpected API response format:', response.data);
            setRecommendations([]);
          }
        } catch (err: any) {
          if (err.response?.status === 400) {
            setError("preferences");
          } else {
            throw err;
          }
        }
      } 
      else {
        const response = await axios.get('http://localhost:5050/api/admin/trips');
        
        const popularTrips = response.data
          .filter((trip: any) => trip.availableSpots > 0)
          .sort((a: any, b: any) => a.availableSpots - b.availableSpots)
          .slice(0, 6)
          .map((trip: any) => {
            const bookedSpots = (trip.totalSpots || 20) - (trip.availableSpots || 0);
            const bookedPercentage = Math.round((bookedSpots / (trip.totalSpots || 20)) * 100);
            
            const reasons = [];
            if (trip.availableSpots <= 3) {
              reasons.push('Tik kelios vietos liko!');
            } else if (bookedPercentage >= 70) {
              reasons.push('Labai populiarus pasirinkimas');
            } else {
              reasons.push('Populiarus pasirinkimas');
            }
            
            if (trip.availableSpots > 5) {
              reasons.push('Daug laisvų vietų');
            }
            
            return {
              tripId: trip.id,
              title: trip.name,
              description: trip.description,
              startDate: trip.startDate,
              endDate: trip.endDate,
              price: trip.price,
              duration: trip.duration || Math.floor((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)),
              routeId: trip.routeId,
              routeName: trip.routeName,
              availableSpots: trip.availableSpots || 0,
              totalSpots: trip.totalSpots || 0,
              mainImage: trip.mainImage,  // ✅ ADD IMAGE
              score: 75,
              matchPercentage: 75,
              reasons: reasons,
            };
          });
        
        setRecommendations(popularTrips);
      }
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
      setError("general");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        
          <h1 className="text-5xl font-extrabold mb-4">
            {isGuest ? 'Atraskite Savo Svajonių Kelionę' : 'Jūsų Personalizuotos Kelionės'}
          </h1>
          <p className="text-lg mb-6">
            {isGuest ? 'Planuokite idealias atostogas su mumis' : 'Kelionės, pritaikytos jūsų pageidavimams'}
          </p>
          {isGuest && (
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold inline-flex items-center shadow-lg"
            >
              Prisijungti ir Gauti Rekomendacijas
            </Link>
          )}
          {error === "preferences" && !isGuest && (
            <Link
              to="/preferences"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold inline-flex items-center shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Nustatyti pasirinkimus
            </Link>
          )}
        </div>
      </header>

      {/* Recommendations Section */}
      <main className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {error === "preferences" 
                  ? "Personalizuokite Savo Patirtį" 
                  : isGuest 
                  ? "Populiariausios Kelionės" 
                  : "Jums Rekomenduojamos Kelionės"}
              </h2>
              <p className="text-gray-600">
                {error === "preferences" 
                  ? "Nustatykite pasirinkimus ir gaukite pritaikytas rekomendacijas"
                  : isGuest
                  ? "Prisijunkite ir gaukite personalizuotas rekomendacijas"
                  : "Pagal jūsų pageidavimus ir interesus"}
              </p>
            </div>
            {!error && !isGuest && (
              <Link
                to="/preferences"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold flex items-center"
              >
                Keisti pasirinkimus
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Kraunamos kelionės...</p>
            </div>
          ) : error === "preferences" ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-blue-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Gaukite Personalizuotas Rekomendacijas
              </h3>
              <p className="text-gray-600 mb-6">
                Nustatykite savo pasirinkimus ir mes rekomenduosime jums idealiai tinkamas keliones
              </p>
              <Link
                to="/preferences"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Pradėti Dabar
              </Link>
            </div>
          ) : error === "general" ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nepavyko užkrauti kelionių
              </h3>
              <p className="text-gray-600 mb-6">Įvyko klaida kraunant keliones</p>
              <button
                onClick={fetchRecommendations}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Bandyti dar kartą
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Šiuo metu nėra tinkamų kelionių
              </h3>
              <p className="text-gray-600 mb-4">
                {isGuest 
                  ? "Prisijunkite ir nustatykite pasirinkimus personalizuotoms rekomendacijoms"
                  : "Pabandykite pakeisti savo pasirinkimus arba žiūrėkite visas keliones"}
              </p>
              <div className="flex justify-center space-x-3">
                {isGuest ? (
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Prisijungti
                  </Link>
                ) : (
                  <Link
                    to="/preferences"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Keisti pasirinkimus
                  </Link>
                )}
                <Link
                  to="/trips"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Visos Kelionės
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map(rec => (
                <TripCard key={rec.tripId} rec={rec} isGuest={isGuest} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      {!error && recommendations.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isGuest ? 'Pasiruošę Pradėti?' : 'Pasiruošę Naujoms Nuotykiams?'}
            </h2>
            <p className="text-white text-lg mb-8">
              {isGuest 
                ? 'Prisijunkite ir gaukite personalizuotas rekomendacijas pagal jūsų pageidavimus'
                : 'Pakeiskite pasirinkimus arba naršykite visą kelionių katalogą'}
            </p>
            <div className="flex justify-center space-x-4">
              {isGuest ? (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    Prisijungti
                  </Link>
                  <Link
                    to="/signup"
                    className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold"
                  >
                    Registruotis
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/preferences"
                    className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    Keisti pasirinkimus
                  </Link>
                  <Link
                    to="/trips"
                    className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold"
                  >
                    Visos Kelionės
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};