import React, { useState } from "react";
// import { Link } from "react-router-dom"; 
import { apiClient } from "../../../api/AxiosInstace";
import BackButton from '../../../components/BackButton';

export const EstimateTimePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await apiClient.get(`/api/Route/estimate-info?from=${from}&to=${to}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Nepavyko apskaičiuoti. Patikrinkite miestų pavadinimus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
      
    <div className="mb-6">
      <BackButton />
    </div>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Greitas Trukmės Įvertinimas
      </h2>
      <form onSubmit={handleEstimate} className="flex flex-col gap-5">
        <div className="flex gap-4">
            <div className="w-1/2">
                <label className="block font-semibold mb-1 text-gray-700">Pradžios taškas</label>
                <input 
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-purple-500 outline-none" 
                    placeholder="pvz. Vilnius" 
                    value={from} 
                    onChange={e => setFrom(e.target.value)} 
                    required
                />
            </div>
            <div className="w-1/2">
                <label className="block font-semibold mb-1 text-gray-700">Galutinis taškas</label>
                <input 
                    className="w-full border p-3 rounded focus:ring-2 focus:ring-purple-500 outline-none" 
                    placeholder="pvz. Paryžius" 
                    value={to} 
                    onChange={e => setTo(e.target.value)} 
                    required
                />
            </div>
        </div>

        <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded font-bold hover:bg-purple-700 transition shadow-md"
        >
          {loading ? "Skaičiuojama..." : "Skaičiuoti Atstumą ir Laiką"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
        </div>
      )}

      {result && (
        <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg text-center animate-fade-in">
          <h3 className="text-lg font-bold text-purple-900 uppercase tracking-wide mb-2">Rezultatai</h3>
          
          <div className="flex justify-center items-center gap-8 mt-4">
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Atstumas</p>
                <p className="text-3xl font-bold text-gray-800">{Math.round(result.distanceKm)} km</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Rekomenduojama Trukmė</p>
                <p className="text-3xl font-bold text-purple-600">{result.estimatedDays} d.</p>
                <p className="text-xs text-gray-400">Vairavimo laikas: {result.durationText}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-purple-200 pt-4">
            <p className="text-sm text-gray-600">
            </p>
          </div>
        </div>
      )}
    </div>
  );
};