import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from "../../../components/BackButton";

// FIX: Constant defined OUTSIDE the component to prevent reloading errors
const libraries: ("geometry")[] = ["geometry"];
const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 48.8566, lng: 2.3522 };

export const RouteCreatePage = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries, // Use the constant
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calls the smart backend to generate route + save cities + save backup attractions
      const response = await apiClient.post(`/api/Route/generate?from=${from}&to=${to}&interval=300`);
      
      const newRouteId = response.data.routeId;
      // Redirect to Edit page
      navigate(`/admin/routes/preview/${newRouteId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate route. Check city names.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] p-4 gap-4">
      <div className="w-1/3 p-6 border rounded shadow bg-white h-fit">
        <h2 className="text-2xl font-bold mb-4">Create Smart Route</h2>
            <div className="mb-4">
             <BackButton to="/admin/routes" label="Grįžti į sąrašą" />
           </div>
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Start City</label>
            <input 
              className="w-full border p-2 rounded" 
              placeholder="e.g. Berlin" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-1">End City</label>
            <input 
              className="w-full border p-2 rounded" 
              placeholder="e.g. Prague" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-bold"
          >
            {loading ? "Calculating..." : "Generate & Save Draft"}
          </button>
        </form>
        
        {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
      </div>

      <div className="w-2/3 border rounded overflow-hidden bg-gray-100">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        </GoogleMap>
      </div>
    </div>
  );
};