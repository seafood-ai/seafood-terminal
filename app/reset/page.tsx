"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-[45%] flex items-center justify-center bg-[#0F121A]">
        <img src="./logo.png" alt="logo" className="w-100" />
      </div>

      <div className="w-[55%] flex items-center justify-center bg-white">
        <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-xl">
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-4"
                >
                  Enter your email address and we will send you instructions to
                  reset your password.
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-950  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "SENDING..." : "SEND RESET INSTRUCTIONS"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-900">
                Remember you password? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
