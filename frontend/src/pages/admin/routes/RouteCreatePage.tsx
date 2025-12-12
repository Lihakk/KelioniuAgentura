import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { apiClient } from "../../../api/AxiosInstace";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 48.8566, lng: 2.3522 }; // Default center

export const RouteCreatePage = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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
      // 1. Call Backend to Generate & Save Draft
      // This uses the backend function: [HttpPost("generate")]
      const response = await apiClient.post(`/api/Route/generate?from=${from}&to=${to}&interval=300`);
      
      // 2. Redirect to Edit Page to finalize details
      const newRouteId = response.data.routeId;
      navigate(`/admin/routes/edit/${newRouteId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate route. Check city names.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Input Form */}
      <div className="w-1/3 p-6 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-4">Create Preliminary Route</h2>
        
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
              placeholder="e.g. Warsaw" 
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
            {loading ? "Generating..." : "Generate & Save Draft"}
          </button>
        </form>
        
        {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
      </div>

      {/* Map Placeholder */}
      <div className="w-2/3 border rounded overflow-hidden bg-gray-100">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
          {/* Map is empty here until we generate */}
        </GoogleMap>
      </div>
    </div>
  );
};