"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Landings from "@/components/custom/Landings";
import MarketPrices from "@/components/custom/MarketPrices";
import MarketSignals from "@/components/custom/MarketSignals";
import QuotaUsage from "@/components/custom/QuotaUsage";
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

  return <div className="bg-white"></div>;
}
