import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { GetUserProfile } from "../api/user/GetUserProfile";
import type { UserProfile } from "../types/User";
import { apiClient } from "../api/AxiosInstace";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetUserProfile();
      setProfile(data);
    };
    fetchData();
  }, []);

  const handleDeleteProfile = async () => {
    try {
      await apiClient.delete("/api/User/Delete");

      try {
        await apiClient.post("/api/User/Logout");
      } catch {}

      window.location.replace("/");
    } catch (err) {
      console.error("Failed to delete profile", err);
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mano profilis</h1>
          <BackButton />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Vartotojo informacija
            </h2>
            <p className="text-gray-600 mt-2">
              <strong>Vardas ir pavardė:</strong> {profile?.firstName}{" "}
              {profile?.lastName}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>El. paštas:</strong> {profile?.email}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Rolė:</strong> {profile?.role}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => navigate("/profile/edit")}
              className="w-full rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Redaguoti profilį
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="w-full rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700"
            >
              Ištrinti paskyrą
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Patvirtinimas</h2>
            <p className="mb-6">
              Ar tikrai norite ištrinti savo paskyrą? Šio veiksmo atšaukti
              negalėsite.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                Atšaukti
              </button>

              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Ištrinti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
