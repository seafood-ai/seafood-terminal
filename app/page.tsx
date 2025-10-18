"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuBell, LuCircleDollarSign, LuFish, LuGlobe } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Updated type definition for the API response item
interface MarketPriceApiItem {
  species_sku: string;
  origin: string;
  price: number;
  price_unit: string;
  weekly_trend: number;
  yoy: number;
}

// Type for processed market price data
interface ProcessedMarketPrice {
  species_sku: string;
  origin: string;
  price: string;
  weekly_trend: number;
  yoy: number;
}

// Type for landings API response
interface LandingsApiItem {
  year: number;
  region: string;
  nmfs_name: string;
  pounds: number;
  dollars: number;
  metric_tons: number;
}

// Type for processed landings data
interface ProcessedLanding {
  species: string;
  volume: string;
  avgPrice: string;
  port: string;
  date: string;
}

export default function Home() {
  const [marketPrices, setMarketPrices] = useState<ProcessedMarketPrice[]>([]);
  const [landings, setLandings] = useState<ProcessedLanding[]>([]);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(true);
  const [loadingLandings, setLoadingLandings] = useState<boolean>(true);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [landingsError, setLandingsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        setLoadingMarket(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MARKET_PRICES}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MarketPriceApiItem[] = await response.json();

        const processedData: ProcessedMarketPrice[] = data.map(
          (item: MarketPriceApiItem): ProcessedMarketPrice => {
            return {
              species_sku: item.species_sku,
              origin: item.origin,
              price: `€${item.price.toFixed(2)}/${item.price_unit}`,
              weekly_trend: item.weekly_trend,
              yoy: item.yoy,
            };
          }
        );

        setMarketPrices(processedData);
        setMarketError(null);
      } catch (err: unknown) {
        console.error("Error fetching market prices:", err);
        setMarketError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoadingMarket(false);
      }
    };

    fetchMarketPrices();
  }, []);

  useEffect(() => {
    const fetchLandings = async () => {
      try {
        setLoadingLandings(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_LANDINGS}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LandingsApiItem[] = await response.json();

        const processedData: ProcessedLanding[] = data.map(
          (item: LandingsApiItem): ProcessedLanding => {
            // Calculate average price per pound
            const avgPricePerPound =
              item.pounds > 0 ? item.dollars / item.pounds : 0;

            // Format species name (remove "CRAB, " prefix etc for cleaner display)
            const speciesName = item.nmfs_name
              .replace(/\*\*/g, "") // Add this line to remove all ** symbols
              .split(", ")
              .reverse()
              .join(" ")
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            const displayDate = `${item.year}`;

            return {
              species: speciesName,
              volume: item.metric_tons.toLocaleString(),
              avgPrice: `$${avgPricePerPound.toFixed(2)}`,
              port: item.region,
              date: displayDate,
            };
          }
        );

        setLandings(processedData);
        setLandingsError(null);
      } catch (err: unknown) {
        console.error("Error fetching landings:", err);
        setLandingsError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoadingLandings(false);
      }
    };

    fetchLandings();
  }, []);

  const formatTrend = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatYoY = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

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
            <div className="border-1 p-3 rounded-md shadow-sm bg-white">
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-1">
                <LuFish />
                Quota Usage
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Alaska Crab: 78% used</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Halibut IFQ: 62% used</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Salmon Cook Inlet: 42% used</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:hidden mt-6">
              {/* Global Snapshot */}
              <div className="mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <LuGlobe size={"12px"} />
                  <h3 className="text-sm font-medium text-gray-900">
                    Global Snapshot
                  </h3>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  FAO: Global catch stable at 90.3 MT
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Euronext Salmon: $7.50/kg (Sept futures)
                </div>
              </div>

              {/* Market Signals */}
              <div className="border-1 p-3 rounded-md shadow-sm bg-white">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Market Signals
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      NOAA: New Alaska halibut landings report released
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      EU: Quota bulletin for North Sea cod updated
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      SeafoodSource: Rising crab demand in Asia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Market Prices */}
            <div className="col-span-3 md:col-span-2 mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-4">
                <LuCircleDollarSign />
                <h3 className="text-sm font-medium text-gray-900">
                  Market Prices
                </h3>
              </div>

              {/* Loading State */}
              {loadingMarket && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading market prices...</div>
                </div>
              )}

              {/* Error State */}
              {marketError && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-red-500">
                    Error loading data: {marketError}
                  </div>
                </div>
              )}

              {/* Data Table */}
              {!loadingMarket && !marketError && (
                <div className="overflow-x-auto mb-4">
                  <div className="min-w-max min-h-max">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 pb-2 mb-3 border-b border-gray-200 text-sm font-semibold text-gray-600 text-center">
                      <div>Species/SKU</div>
                      <div>Origin</div>
                      <div>Spot Price</div>
                      <div>Weekly Trend</div>
                      <div>YoY %</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2 ml-2 max-h-64 overflow-y-auto">
                      {marketPrices.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No market price data available
                        </div>
                      ) : (
                        marketPrices.map(
                          (item: ProcessedMarketPrice, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-5 gap-4 py-1 text-sm border-b border-gray-200"
                            >
                              <div className="text-gray-900">
                                {item.species_sku}
                              </div>
                              <div className="text-gray-700">{item.origin}</div>
                              <div className="text-gray-700">{item.price}</div>
                              <div
                                className={`text-gray-700 ${
                                  item.weekly_trend >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatTrend(item.weekly_trend)}
                              </div>
                              <div
                                className={`text-gray-700 ${
                                  item.yoy >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatYoY(item.yoy)}
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4 hidden md:block">
              {/* Global Snapshot */}
              <div className="mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <LuGlobe size={"12px"} />
                  <h3 className="text-sm font-medium text-gray-900">
                    Global Snapshot
                  </h3>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  FAO: Global catch stable at 90.3 MT
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Euronext Salmon: $7.50/kg (Sept futures)
                </div>
              </div>

              {/* Market Signals */}
              <div className="border-1 p-3 rounded-md shadow-sm bg-white">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Market Signals
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      NOAA: New Alaska halibut landings report released
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      EU: Quota bulletin for North Sea cod updated
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      SeafoodSource: Rising crab demand in Asia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auctions & Landings */}
            <div className="col-span-3 md:col-span-2 mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-4">
                <FaArrowTrendUp />
                <h3 className="text-sm font-medium text-gray-900">
                  Auctions & Landings
                </h3>
              </div>

              {/* Loading State */}
              {loadingLandings && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading landings data...</div>
                </div>
              )}

              {/* Error State */}
              {landingsError && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-red-500">
                    Error loading data: {landingsError}
                  </div>
                </div>
              )}

              {/* Scrollable Table Container */}
              {!loadingLandings && !landingsError && (
                <div className="overflow-x-auto mb-4">
                  <div className="min-w-max min-h-max">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 pb-2 mb-3 border-b border-gray-200 text-sm font-semibold text-gray-600 text-center">
                      <div>Species</div>
                      <div>Volume (MT)</div>
                      <div>Avg Price</div>
                      <div>Region</div>
                      <div>Year</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2 ml-2 max-h-64 overflow-y-auto">
                      {landings.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No landings data available
                        </div>
                      ) : (
                        landings.map(
                          (item: ProcessedLanding, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-5 gap-4 py-1 text-sm border-b border-gray-200"
                            >
                              <div className="text-gray-900">
                                {item.species}
                              </div>
                              <div className="text-gray-700">{item.volume}</div>
                              <div className="text-gray-700">
                                {item.avgPrice}
                              </div>
                              <div className="text-gray-700">{item.port}</div>
                              <div className="text-gray-700">{item.date}</div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
