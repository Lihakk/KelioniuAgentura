import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from "../../../components/BackButton";

// --- ICONS ---
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const RoutesDashboardPage = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await apiClient.get("/api/Route");
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Maršrutų Valdymas</h1>
          <p className="text-gray-500 mt-1">Kurkite, redaguokite ir valdykite kelionių maršrutus.</p>
        </div>
            <div className="mb-4">
             <BackButton to="/admin" label="Grįžti" />
           </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Mygtukas: Trukmės įvertinimas */}
          <Link 
            to="/admin/routes/estimate" 
            className="flex items-center bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 px-5 py-3 rounded-lg font-bold shadow-sm transition-all transform hover:scale-105"
          >
            <ClockIcon />
            Įvertinti Trukmę
          </Link>

          {/* Mygtukas: Kurti naują */}
          <Link 
            to="/admin/routes/create" 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-bold shadow-md transition-all transform hover:scale-105"
          >
            <PlusIcon />
            Kurti Naują Maršrutą
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Kraunami duomenys...</div>
        ) : routes.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <PlusIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Nėra sukurtų maršrutų</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Pradėkite sukurdami pirmąjį maršrutą savo klientams.</p>
            <Link to="/admin/routes/create" className="text-blue-600 font-bold hover:underline">Sukurti dabar &rarr;</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">Maršrutas</th>
                  <th className="p-4 font-bold">Kryptis (Nuo - Iki)</th>
                  <th className="p-4 font-bold text-center">Atstumas</th>
                  <th className="p-4 font-bold text-center">Būsena</th>
                  <th className="p-4 font-bold text-center">Veiksmai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{route.name}</div>
                      <div className="text-xs text-gray-400">ID: #{route.id}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className="font-medium text-gray-900">{route.startCity}</span> 
                      <span className="mx-2 text-gray-400">&rarr;</span> 
                      <span className="font-medium text-gray-900">{route.endCity}</span>
                    </td>
                    <td className="p-4 text-center font-mono text-gray-600">
                      {Math.round(route.distanceKm).toLocaleString()} km
                    </td>
                    <td className="p-4 text-center">
                      {route.isDraft ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Juodraštis
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Patvirtintas
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/routes/preview/${route.id}`} 
                          title="Peržiūrėti"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                        >
                          <EyeIcon />
                        </Link>
                        <Link 
                          to={`/admin/routes/edit/${route.id}`} 
                          title="Redaguoti"
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition"
                        >
                          <PencilIcon />
                        </Link>
                        <Link 
                          to={`/admin/routes/cancel/${route.id}`} 
                          title="Atšaukti / Ištrinti"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                        >
                          <TrashIcon />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};