import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from "../../../components/BackButton"; // <--- Import your new component

const libraries: ("geometry")[] = ["geometry"];


interface Stop {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isSelected: boolean;
  rating: number;
}

interface RouteData {
  id: number;
  name: string;
  durationDays: number;
  season: string;
  encodedPolyline: string;
  stops: Stop[];
  distanceKm: number;
}

export const RouteEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [route, setRoute] = useState<RouteData | null>(null);
  const [originalRoute, setOriginalRoute] = useState<RouteData | null>(null);
  const [path, setPath] = useState<google.maps.LatLng[]>([]);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [showBackups, setShowBackups] = useState(false);

  useEffect(() => {
    loadRoute();
  }, [id, isLoaded]);

  const loadRoute = async () => {
    try {
      const res = await apiClient.get(`/api/Route/${id}`);
      setRoute(res.data);
      setOriginalRoute(JSON.parse(JSON.stringify(res.data)));
      
      if (window.google && res.data.encodedPolyline) {
        const decodedPath = window.google.maps.geometry.encoding.decodePath(res.data.encodedPolyline);
        setPath(decodedPath);
      }
    } catch (err) {
      console.error("Failed to load route:", err);
    }
  };

  const toggleStopSelection = (stopIndex: number, isActive: boolean) => {
    if (!route) return;
    const newStops = [...route.stops];
    newStops[stopIndex].isSelected = isActive;
    setRoute({ ...route, stops: newStops });
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await apiClient.put(`/api/Route/${id}`, route);
      const res = await apiClient.post(`/api/Route/${id}/recalculate`);
      
      if (window.google && res.data.encodedPolyline) {
        const decodedPath = window.google.maps.geometry.encoding.decodePath(res.data.encodedPolyline);
        setPath(decodedPath);
      }
      
      if (route) {
        setRoute({ ...route, encodedPolyline: res.data.encodedPolyline, distanceKm: res.data.distanceKm });
      }
      alert(`Maršrutas perskaičiuotas! Naujas atstumas: ${Math.round(res.data.distanceKm)} km`);
    } catch (err) {
      console.error(err);
      alert("Nepavyko perskaičiuoti maršruto.");
    } finally {
      setRecalculating(false);
    }
  };

  const handleConfirmChanges = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/api/Route/${id}`, route);
      alert("Pakeitimai sėkmingai išsaugoti!");
      navigate(`/admin/routes/preview/${id}`);
    } catch (err) {
      alert("Nepavyko išsaugoti pakeitimų.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelChanges = async () => {
    if (window.confirm("Ar tikrai norite atšaukti visus pakeitimus?")) {
      if (!originalRoute) return;
      setSaving(true); 
      try {
        setRoute(JSON.parse(JSON.stringify(originalRoute)));
        if (window.google && originalRoute.encodedPolyline) {
            const decodedPath = window.google.maps.geometry.encoding.decodePath(originalRoute.encodedPolyline);
            setPath(decodedPath);
        }
        await apiClient.put(`/api/Route/${id}`, originalRoute);
        alert("Pakeitimai sėkmingai atšaukti (Duomenys atstatyti).");
        navigate("/admin/routes");
      } catch (err) {
          console.error(err);
          alert("Nepavyko atstatyti duomenų duomenų bazėje.");
      } finally {
          setSaving(false);
      }
    }
  };

  if (!isLoaded || !route) return <div>Kraunama...</div>;

  const activeStops = route.stops.map((s, i) => ({ ...s, originalIndex: i })).filter(s => s.isSelected);
  const backupStops = route.stops.map((s, i) => ({ ...s, originalIndex: i })).filter(s => !s.isSelected);

  return (
    <div className="flex h-[calc(100vh-180px)]">
      

      <div className="w-[300px] bg-white flex flex-col border-r shadow-lg z-10">
        
        <div className="p-4 border-b bg-gray-50">

           <div className="mb-4">
             <BackButton to="/admin/routes" label="Grįžti į sąrašą" />
           </div>

           <h2 className="text-xl font-bold mb-2">Redaguoti Maršrutą</h2>
           <input 
             className="w-full border p-2 rounded mb-2 text-sm" 
             value={route.name} 
             onChange={(e) => setRoute({...route, name: e.target.value})}
             placeholder="Maršruto pavadinimas"
           />
           <div className="flex gap-2 mb-2">
             <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-500">Trukmė (dienos)</label>
                <input type="number" className="w-full border p-2 rounded text-sm" 
                   value={route.durationDays} 
                   onChange={(e) => setRoute({...route, durationDays: parseInt(e.target.value) || 0})}
                />
             </div>
             <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-500">Sezonas</label>
                <input className="w-full border p-2 rounded text-sm" 
                   value={route.season} 
                   onChange={(e) => setRoute({...route, season: e.target.value})}
                />
             </div>
           </div>
           <p className="text-xs text-gray-500 text-right">Atstumas: {Math.round(route.distanceKm || 0)} km</p>
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-bold text-gray-700 mb-2">Sustojimai ({activeStops.length})</h3>
          
          {activeStops.map((stop) => (
            <div key={stop.originalIndex} className="mb-2 p-3 border-l-4 border-blue-500 bg-white shadow-sm rounded flex justify-between items-center group">
              <div className="flex-1 pr-2"> {/* Added flex-1 and pr-2 to text container */}
                <p className="font-bold text-sm">{stop.name}</p>
                <p className="text-xs text-gray-500 truncate">{stop.address}</p>
              </div>
              <button 
                onClick={() => toggleStopSelection(stop.originalIndex, false)}
                className="text-red-500 text-xs font-bold border border-red-200 px-2 py-1 rounded bg-white hover:bg-red-50 transition shrink-0"
              >
                PAŠALINTI
              </button>
            </div>
          ))}

          <div className="mt-6 border-t pt-4">
            <button 
              onClick={() => setShowBackups(!showBackups)}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded font-semibold text-sm hover:bg-gray-200"
            >
              {showBackups ? "Slėpti Alternatyvas" : `Rodyti ${backupStops.length} Alternatyvas`}
            </button>
          </div>

          {showBackups && (
            <div className="mt-4 animate-fade-in">
              <h3 className="font-bold text-gray-500 text-sm mb-2">Galimos Alternatyvos</h3>
              {backupStops.map((stop) => (
                <div key={stop.originalIndex} className="mb-2 p-3 border border-gray-200 bg-gray-50 rounded flex justify-between items-center opacity-75 hover:opacity-100 transition">
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-sm text-gray-700">{stop.name}</p>
                    <span className="text-xs text-orange-400 font-bold">★ {stop.rating}</span>
                  </div>
                  <button 
                    onClick={() => toggleStopSelection(stop.originalIndex, true)}
                    className="text-green-600 text-xs font-bold border border-green-200 px-2 py-1 rounded bg-white hover:bg-green-50 transition shrink-0"
                  >
                    PRIDĖTI
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
          <button 
            onClick={handleRecalculate}
            disabled={recalculating || saving}
            className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 shadow transition flex justify-center items-center"
          >
            {recalculating ? "Skaičiuojama..." : "Perskaičiuoti maršrutą "}
          </button>

          <div className="flex gap-2">
            <button 
              onClick={handleConfirmChanges} 
              disabled={saving || recalculating}
              className="w-1/2 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 shadow transition"
            >
              {saving ? "Saugoma..." : "Išsaugoti"}
            </button>
            <button 
              onClick={handleCancelChanges} 
              disabled={saving || recalculating}
              className="w-1/2 bg-gray-300 text-gray-800 py-3 rounded font-bold hover:bg-gray-400 shadow transition"
            >
              Atšaukti
            </button>
          </div>
        </div>
      </div>

{/* Map Panel: Using absolute positioning to force full fill */}
      <div className="flex-1 relative h-full min-w-0 bg-gray-100">
        <div className="absolute inset-0">
          <GoogleMap 
            mapContainerStyle={{ width: "100%", height: "100%" }} 
            center={path[0] || {lat: 54.6872, lng: 25.2797}} // Default to Vilnius if empty
            zoom={6}
          >
            {path.length > 0 && (
              <Polyline 
                  key={route?.encodedPolyline} 
                  path={path} 
                  options={{ strokeColor: "#2196F3", strokeOpacity: 0.8, strokeWeight: 5 }} 
              />
            )}
            {activeStops.map((stop) => (
              <Marker 
                key={stop.originalIndex} 
                position={{ lat: stop.latitude, lng: stop.longitude }} 
                title={stop.name} 
              />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};