"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuBell } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Landings from "@/components/custom/Landings";
import MarketPrices from "@/components/custom/MarketPrices";
import MarketSignals from "@/components/custom/MarketSignals";
import QuotaUsage from "@/components/custom/QuotaUsage";
import GlobalSnapshot from "@/components/custom/GlobalSnapshot";

export default function Home() {
  const router = useRouter();

  const handleTerminalClick = () => {
    router.push("/terminal");
  };

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
            <Button variant={"outline"} className="shadow-sm">
              <LuBell />
              Alerts
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48">
          <div className="p-4">
            {/* Terminal Button */}
            <div className="mb-6">
              <Button
                onClick={handleTerminalClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                Terminal
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Filters
              </h3>
              <div className="space-y-1">
                <Button
                  variant={"outline"}
                  className="shadow-md w-full bg-[#ececec] cursor-pointer mb-2"
                >
                  Alerts
                </Button>
                <Button
                  variant={"outline"}
                  className="shadow-md w-full bg-[#ececec] cursor-pointer mb-2"
                >
                  Halibut
                </Button>
                <Button
                  variant={"outline"}
                  className="shadow-md w-full bg-[#ececec] cursor-pointer mb-2"
                >
                  Salmon
                </Button>
                <Button
                  variant={"outline"}
                  className="shadow-md w-full bg-[#ececec] cursor-pointer mb-2"
                >
                  Other Species
                </Button>
              </div>
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
