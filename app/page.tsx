"use client";

import { useRouter } from "next/navigation";
import { getToken } from "../utils/lib/auth";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      } else if (token) {
        router.push("/dashboard");
      }
    };

    fetchProfile();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );
}
