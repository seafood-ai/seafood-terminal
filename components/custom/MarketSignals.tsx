import { getToken } from "@/utils/lib/auth";
import React, { useEffect, useState } from "react";

// Type for market signals API response
interface SignalsApiItem {
  title: string;
  published_date: string;
}

const MarketSignals = () => {
  const [signals, setSignals] = useState<SignalsApiItem[]>([]);
  const [loadingSignals, setLoadingSignals] = useState<boolean>(true);
  const [signalsError, setSignalsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoadingSignals(true);

        // 1. Check localStorage for cached data
        const cached = localStorage.getItem("market_signals_cache");
        const cacheTime = localStorage.getItem("market_signals_cache_time");

        // optional: 10 minutes validity
        const CACHE_DURATION = 10 * 60 * 1000;

        if (
          cached &&
          cacheTime &&
          Date.now() - Number(cacheTime) < CACHE_DURATION
        ) {
          const parsed = JSON.parse(cached);
          setSignals(parsed);
          setLoadingSignals(false);
          return;
        }

        // 2. No cache or cache expired → fetch new data
        const token = getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_SIGNALS}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SignalsApiItem[] = await response.json();

        // 3. Save data into cache for next reload
        localStorage.setItem("market_signals_cache", JSON.stringify(data));
        localStorage.setItem(
          "market_signals_cache_time",
          Date.now().toString()
        );

        setSignals(data);
        setSignalsError(null);
      } catch (err: unknown) {
        console.error("Error fetching market signals:", err);
        setSignalsError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoadingSignals(false);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div className="border-1 p-3 rounded-md shadow-sm bg-white">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Market Signals</h3>
      <div className="space-y-2 max-h-45 overflow-y-auto">
        {/* Loading State */}
        {loadingSignals && (
          <div className="flex items-center justify-center py-2">
            <div className="text-gray-500 text-[12.5px]">
              Loading landings data...
            </div>
          </div>
        )}

        {/* Error State */}
        {signalsError && (
          <div className="flex items-center justify-center py-2">
            <div className="text-red-500 text-[12.5px]">
              Error loading data: {signalsError}
            </div>
          </div>
        )}

        {/* Content */}
        {!loadingSignals &&
          !signalsError &&
          (signals.length === 0 ? (
            <div className="text-gray-500 text-[12.5px]">
              No market signals data available
            </div>
          ) : (
            signals.map((item: SignalsApiItem, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex flex-col w-full">
                  <p className="text-[12.5px]  text-gray-700 leading-relaxed">
                    {item.title}
                  </p>
                  <p className="pr-4 text-xs text-right text-gray-500 leading-relaxed">
                    {item.published_date}
                  </p>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default MarketSignals;
