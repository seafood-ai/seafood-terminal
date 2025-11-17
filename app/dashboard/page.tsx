"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Landings from "@/components/custom/Landings";
import MarketPrices from "@/components/custom/MarketPrices";
import MarketSignals from "@/components/custom/MarketSignals";
import QuotaUsage from "@/components/custom/QuotaUsage";
import { getToken, removeToken } from "../../utils/lib/auth";
import { useEffect } from "react";
import GlobalSnapshot from "@/components/custom/GlobalSnapshot";

export default function Home() {
  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const handleTerminalClick = () => {
    router.push("/terminal");
  };
  if (token) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="px-6 py-3 sticky top-0 bg-gray-100 shadow">
          <div className="flex items-center justify-center md:justify-between">
            <h1 className="text-xl font-bold text-gray-900 hidden md:block">
              SeafoodAI Free MVP Dashboard
            </h1>
            <div className="flex justify-between items-center gap-4 w-full md:w-125">
              <div className="relative flex-1">
                <Input
                  className="md:w-100 bg-white"
                  type="text"
                  placeholder="Search species, port, quota..."
                />
              </div>
              <Button
                variant={"outline"}
                className="shadow-sm cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-50">
            <div className="p-4 pr-0">
              {/* Terminal Button */}
              <div className="mb-6">
                <Button
                  onClick={handleTerminalClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                  Terminal
                </Button>
              </div>

              {/* Quota Usage */}
              <QuotaUsage />

              <div className="space-y-4 md:hidden mt-6">
                {/* Global Snapshot */}
                <GlobalSnapshot />

                {/* Market Signals */}
                <MarketSignals />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Market Prices */}
              <MarketPrices />

              {/* Right Column */}
              <div className="space-y-4 hidden md:block">
                {/* Global Snapshot */}
                <GlobalSnapshot />
                {/* Market Signals - Desktop*/}
                <MarketSignals />
              </div>
              {/* Auctions and Landings */}
              <Landings />
            </div>
          </main>
        </div>
      </div>
    );
  }
}
