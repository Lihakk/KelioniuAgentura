import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../api/AxiosInstace";

export const RoutesDashboardPage = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await apiClient.get("/api/Route");
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel/delete this route?")) return;
    try {
      await apiClient.delete(`/api/Route/${id}`);
      loadRoutes(); // Refresh list
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Route Management</h2>
        <Link to="/admin/routes/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
          + Create New Route
        </Link>
      </div>

      <table className="w-full border-collapse border shadow-sm bg-white text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border p-3">Route Name</th>
            <th className="border p-3">From - To</th>
            <th className="border p-3">Distance</th>
            <th className="border p-3">Status</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route: any) => (
            <tr key={route.id} className="hover:bg-gray-50">
              <td className="border p-3 font-medium">{route.name}</td>
              <td className="border p-3">{route.startCity} - {route.endCity}</td>
              <td className="border p-3">{route.distanceKm.toFixed(0)} km</td>
              <td className="border p-3">
                {route.isDraft ? (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Draft</span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Published</span>
                )}
              </td>
              <td className="border p-3 text-center space-x-3">
                <Link to={`/admin/routes/preview/${route.id}`} className="text-gray-600 hover:text-black">Preview</Link>
                <Link to={`/admin/routes/edit/${route.id}`} className="text-blue-600 hover:text-blue-800 font-bold">Edit</Link>
                <button onClick={() => handleDelete(route.id)} className="text-red-500 hover:text-red-700 font-bold">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};