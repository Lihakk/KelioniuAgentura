import React, { useState } from "react";
import { apiClient } from "../../../api/AxiosInstace";

export const EstimateTimePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Reusing the generate logic but we won't redirect, just show data
      const res = await apiClient.post(`/api/Route/generate?from=${from}&to=${to}`);
      setResult(res.data); // This gives us routeId, but we can re-fetch details if needed or assume backend returns basics
      // If generate only returns ID, we might need to fetch the specific route to get duration.
      // Assuming your backend returns { message, routeId } or full route.
      // Let's quick-fetch the created draft to get the duration.
      const detailRes = await apiClient.get(`/api/Route/${res.data.routeId}`);
      setResult(detailRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Route Duration Estimator</h2>
      
      <form onSubmit={handleEstimate} className="bg-white p-6 rounded shadow-md border">
        <div className="mb-4">
          <label className="block font-bold mb-1">From</label>
          <input className="w-full border p-2 rounded" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">To</label>
          <input className="w-full border p-2 rounded" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button className="w-full bg-purple-600 text-white p-2 rounded font-bold hover:bg-purple-700">
          {loading ? "Calculating..." : "Calculate Duration"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-center">
          <h3 className="text-lg font-bold text-blue-800">Results</h3>
          <p className="text-3xl font-bold mt-2">{result.durationDays} Days</p>
          <p className="text-gray-600">(Approx driving distance: {result.distanceKm} km)</p>
          <p className="text-xs text-gray-500 mt-2">Route ID: {result.id} (Saved as Draft)</p>
        </div>
      )}
    </div>
  );
};