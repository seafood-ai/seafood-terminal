"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/lib/auth";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center flex flex-col items-center">
          <img src="./logo_dark.png" alt="logo" className="w-80 pb-5" />
          {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1> */}
          <p className="text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
