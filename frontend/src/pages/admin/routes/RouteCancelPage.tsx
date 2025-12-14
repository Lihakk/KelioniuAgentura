import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from "../../../components/BackButton";

export const RouteCancelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const res = await apiClient.get(`/api/Route/${id}`);
        setRoute(res.data);
      } catch (err) {
        setError("Nepavyko užkrauti maršruto informacijos.");
      }
    };
    loadRoute();
  }, [id]);

  const handleConfirmCancel = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(`/api/Route/${id}`);
      
      setSuccess("Maršrutas sėkmingai atšauktas.");
      
      setTimeout(() => navigate("/admin/routes/dashboard"), 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Nepavyko atšaukti maršruto. Bandykite vėliau.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!route && !error) return <div className="p-6">Kraunama informacija...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 bg-white border rounded shadow-lg">
            <div className="mb-4">
             <BackButton to="/admin/routes" label="Grįžti į sąrašą" />
           </div>
      <h2 className="text-2xl font-bold mb-4 text-red-600">Maršruto Atšaukimas</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      {route && !success && (
        <>
          <p className="mb-4 text-gray-600">
            Ar tikrai norite atšaukti ir ištrinti šį maršrutą? Šio veiksmo negalima atstatyti.
          </p>
          
          <div className="bg-gray-50 p-4 rounded border mb-6">
            <h3 className="font-bold text-lg mb-2">{route.name}</h3>
            <p><strong>Nuo:</strong> {route.startCity}</p>
            <p><strong>Iki:</strong> {route.endCity}</p>
            <p><strong>Atstumas:</strong> {route.distanceKm} km</p>
            <p><strong>Trukmė:</strong> {route.durationDays} d.</p>
            <p className="mt-2"><strong>Statusas:</strong> {route.isDraft ? "Juodraštis" : "Patvirtintas"}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleConfirmCancel} 
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 shadow w-1/2"
            >
              {loading ? "Atšaukiama..." : "Patvirtinti Atšaukimą"}
            </button>
            
            <button 
              onClick={() => navigate("/admin/routes/dashboard")}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded font-bold hover:bg-gray-400 shadow w-1/2"
            >
              Grįžti atgal
            </button>
          </div>
        </>
      )}
    </div>
  );
};