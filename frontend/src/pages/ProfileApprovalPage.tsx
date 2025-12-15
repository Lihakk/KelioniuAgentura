import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmEmail } from "../api/user/ConfirmEmail";
import { useAuth } from "../context/AuthContext";

const ProfileApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length === 6 && /^[0-9]+$/.test(code)) {
      try {
        await ConfirmEmail(code);

        const reload = await auth.reload();
        if (reload.authenticated) {
          navigate("/");
        } else {
          setError("Nepavyko prisijungti po patvirtinimo.");
        }
      } catch {
        setError("Kodo patvirtinimas nepavyko. Bandykite dar kartą.");
      }
    } else {
      setError("Įveskite galiojantį 6 skaitmenų kodą.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Profilio patvirtinimas
        </h1>

        <p className="text-gray-600 text-center mb-4">
          Įveskite 6 skaitmenų kodą, kurį gavote el. paštu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Patvirtinimo kodas
            </label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-center tracking-widest text-lg"
              placeholder="••••••"
              required
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Patvirtinti
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileApprovalPage;
