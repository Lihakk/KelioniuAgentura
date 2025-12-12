import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";

// 1. Define types to fix "Unexpected any"
interface Stop {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RouteData {
  id: number;
  name: string;
  durationDays: number;
  season: string;
  encodedPolyline: string;
  stops: Stop[];
}

export const RouteEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  // 2. Use the new types instead of 'any'
  const [route, setRoute] = useState<RouteData | null>(null);
  const [path, setPath] = useState<google.maps.LatLng[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const res = await apiClient.get(`/api/Route/${id}`);
        setRoute(res.data);
        
        if (window.google && res.data.encodedPolyline) {
          const decodedPath = window.google.maps.geometry.encoding.decodePath(res.data.encodedPolyline);
          setPath(decodedPath);
        }
      } catch (err) {
        // 3. Log the error to fix "err defined but never used"
        console.error("Failed to load route:", err);
      }
    };
    if (isLoaded) loadRoute();
  }, [id, isLoaded]);

  const handleDeleteStop = (stopIndex: number) => {
    if (!route) return;
    const updatedStops = route.stops.filter((_, index) => index !== stopIndex);
    setRoute({ ...route, stops: updatedStops });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/api/Route/${id}`, route);
      alert("Route updated successfully!");
      navigate("/admin/routes/dashboard");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || !route) return <div>Loading details...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Editor Panel */}
      <div className="w-1/3 bg-white p-4 overflow-y-auto border-r shadow-lg z-10">
        <h2 className="text-xl font-bold mb-4">Edit Route</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold">Route Name</label>
            <input 
              className="w-full border p-2 rounded" 
              value={route.name} 
              onChange={(e) => setRoute({...route, name: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-bold">Duration (Days)</label>
              <input type="number" className="w-full border p-2 rounded" 
                value={route.durationDays} 
                onChange={(e) => setRoute({...route, durationDays: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-bold">Season</label>
              <input className="w-full border p-2 rounded" 
                value={route.season} 
                onChange={(e) => setRoute({...route, season: e.target.value})}
              />
            </div>
          </div>
        </div>

        <h3 className="font-bold border-b pb-2 mb-2">Stops & Attractions</h3>
        {route.stops.map((stop, index) => (
          <div key={index} className="mb-2 p-3 border rounded bg-gray-50 flex justify-between">
            <div>
              <p className="font-bold text-sm">{stop.name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{stop.address}</p>
            </div>
            <button 
              onClick={() => handleDeleteStop(index)}
              className="text-red-600 hover:text-red-800 text-xs font-bold"
            >
              REMOVE
            </button>
          </div>
        ))}

        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Map Panel */}
      <div className="w-2/3">
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={path[0] || {lat:0, lng:0}} zoom={6}>
          {path.length > 0 && (
            <Polyline path={path} options={{ strokeColor: "#2196F3", strokeWeight: 5 }} />
          )}
          {route.stops.map((stop, index) => (
            <Marker key={index} position={{ lat: stop.latitude, lng: stop.longitude }} title={stop.name} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};