import React, { useEffect } from "react";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GetUserProfile } from "../api/user/GetUserProfile";
import type { UserProfile } from "../types/User";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await GetUserProfile();
      setProfile(data);
    };
    fetchData();
  }, []);

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
            <p className="text-gray-600">
              <strong>Vardas ir pavardė:</strong> {profile?.firstName}{" "}
              {profile?.lastName}
            </p>
            <p className="text-gray-600">
              <strong>El. paštas:</strong> {profile?.email}
            </p>
            <p className="text-gray-600">
              <strong>Rolė:</strong> {profile?.role}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/profile/edit")}
              className="mt-2 w-full rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
            >
              Redaguoti profilį
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
