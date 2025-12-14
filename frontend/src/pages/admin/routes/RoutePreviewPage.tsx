import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from "../../../components/BackButton";

// FIX: Constant defined OUTSIDE
const libraries: ("geometry")[] = ["geometry"];

export const RoutePreviewPage = () => {
  const { id } = useParams();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [route, setRoute] = useState<any>(null);
  const [path, setPath] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiClient.get(`/api/Route/${id}`);
        setRoute(res.data);
        if (window.google && res.data.encodedPolyline) {
          setPath(window.google.maps.geometry.encoding.decodePath(res.data.encodedPolyline));
        }
      } catch(e) { console.error(e); }
    };
    if (isLoaded) loadData();
  }, [id, isLoaded]);

  if (!isLoaded || !route) return <div>Loading...</div>;

  // Filter: Only show stops marked as Active (isSelected = true)
  const displayStops = route.stops.filter((s: any) => s.isSelected);

  return (


    
    <div className="flex flex-col p-4 bg-gray-50 h-[calc(100vh-64px)]">
            <div className="mb-4">
             <BackButton to="/admin/routes" label="Grįžti į sąrašą" />
           </div>
      <div className="flex justify-between items-center mb-4 bg-white p-4 shadow rounded">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{route.name}</h2>
           <p className="text-gray-500 text-sm">{route.startCity} ➝ {route.endCity} • {route.distanceKm} km</p>
        </div>
        <Link to={`/admin/routes/edit/${id}`} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 shadow">
           Edit Route
        </Link>
      </div>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="w-1/4 bg-white p-4 rounded shadow overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Itinerary</h3>
          <ul className="space-y-4">
            {displayStops.map((s: any, i: number) => (
              <li key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">{s.name}</span>
                  <span className="text-xs text-gray-500">{s.address}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-3/4 border rounded shadow overflow-hidden bg-white">
          <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={path[0]||{lat:0,lng:0}} zoom={6}>
            {path.length > 0 && <Polyline path={path} options={{ strokeColor: "#2196F3", strokeWeight: 5 }} />}
            {displayStops.map((s: any, i: number) => (
              <Marker key={i} position={{ lat: s.latitude, lng: s.longitude }} title={s.name} label={`${i+1}`} />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};