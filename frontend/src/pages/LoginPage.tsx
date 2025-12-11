// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginCredentials } from "../types/User";
import { AuthenticateUser } from "../api/user/AuthenticateUser";

export const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    const loginInfo: LoginCredentials = {
      username: username.value,
      password: password.value,
    };

    try {
      const result = await AuthenticateUser(loginInfo);

      if (result.success && !result.emailConfirmed) {
        return navigate("/profile/approve");
      }

      const reload = await auth.reload();
      if (reload.authenticated) {
        navigate("/");
      }
    } catch (err: any) {
      alert(err.message || "Invalid username or password");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Prisijungimas</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vartotojo vardas
            </label>
            <input
              name="username"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slaptažodis
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Prisijungti
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="text-center text-gray-600 mt-4">
            Neturite paskyros?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Registruotis puslapyje
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
