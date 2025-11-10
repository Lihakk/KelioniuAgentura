import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();

  // Mocked initial data (can be replaced with real user info later)
  const [formData, setFormData] = useState({
    name: "Jonas Petraitis",
    email: "jonas.petraitis@example.com",
    phone: "+370 600 12345",
    address: "Vilnius, Lietuva",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Redaguoti profilį</h1>
          <BackButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Vardas
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              El. paštas
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefono numeris
            </label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Adresas
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
            >
              Išsaugoti pakeitimus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
