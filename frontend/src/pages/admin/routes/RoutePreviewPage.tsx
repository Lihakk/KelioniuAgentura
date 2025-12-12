import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";

export const RoutePreviewPage = () => {
  const { id } = useParams();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
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

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{route.name}</h2>
        <Link to={`/admin/routes/edit/${id}`} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Switch to Edit Mode</Link>
      </div>
      
      <div className="flex flex-1 gap-4">
        <div className="w-1/4 overflow-y-auto">
          <h3 className="font-bold border-b mb-2">Itinerary</h3>
          <p className="mb-2">Total Distance: {route.distanceKm} km</p>
          <p className="mb-4">Duration: {route.durationDays} Days</p>
          
          <h4 className="font-bold mt-4 mb-2">Stops:</h4>
          <ul className="list-disc pl-5">
            {route.stops.map((s: any, i: number) => (
              <li key={i} className="mb-1">
                <span className="font-medium">{s.name}</span>
                <div className="text-xs text-gray-500">{s.address}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-3/4 border rounded overflow-hidden">
          <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={path[0]||{lat:0,lng:0}} zoom={6}>
            {path.length > 0 && <Polyline path={path} options={{ strokeColor: "#2196F3", strokeWeight: 5 }} />}
            {route.stops.map((s: any, i: number) => (
              <Marker key={i} position={{ lat: s.latitude, lng: s.longitude }} title={s.name} />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};