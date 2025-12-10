// src/pages/SignupPage.tsx
import React from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import type { RegisterUserDetails } from "../types/User";
import { RegisterUser } from "../api/user/RegisterUser";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const firstName = form.elements.namedItem("firstName") as HTMLInputElement;
    const lastName = form.elements.namedItem("lastName") as HTMLInputElement;

    const registerInfo: RegisterUserDetails = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      username: username.value,
      password: password.value,
    };

    console.log(registerInfo);

    await RegisterUser(registerInfo);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sukurti paskyrą</h1>
          <BackButton />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Vardas
            </label>
            <input
              id="firstName"
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Pavardė
            </label>
            <input
              id="lastName"
              type="lastName"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
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
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              S
            </label>
            <input
              id="username"
              type="username"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="password "
              className="block text-sm font-medium text-gray-700"
            >
              Slaptažodis
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Registruotis
          </button>
        </form>
      </div>
    </div>
  );
};
