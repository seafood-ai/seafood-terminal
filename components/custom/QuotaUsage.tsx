import { getToken } from "@/utils/lib/auth";
import React, { useEffect, useState } from "react";
import { LuFish } from "react-icons/lu";

interface QuotaApiItem {
  product_name: string;
  remaining_quota: string;
}

const QuotaUsage = () => {
  const [quotas, setQuotas] = useState<QuotaApiItem[]>([]);
  const [loadingQuotas, setLoadingQuotas] = useState<boolean>(true);
  const [QuotasError, setQuotasError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotas = async () => {
      try {
        setLoadingQuotas(true);

        // 1. Check localStorage for cached data
        const cached = localStorage.getItem("quotas_cache");
        const cacheTime = localStorage.getItem("quotas_cache_time");

        // optional: 10 minutes validity
        const CACHE_DURATION = 10 * 60 * 1000;

        if (
          cached &&
          cacheTime &&
          Date.now() - Number(cacheTime) < CACHE_DURATION
        ) {
          const parsed = JSON.parse(cached);
          setQuotas(parsed);
          setLoadingQuotas(false);
          return;
        }

        // 2. No cache or cache expired → fetch new data
        const token = getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_QUOTAS}`,
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

        const data: QuotaApiItem[] = await response.json();

        // 3. Save data into cache for next reload
        localStorage.setItem("quotas_cache", JSON.stringify(data));
        localStorage.setItem("quotas_cache_time", Date.now().toString());

        setQuotas(data);
        setQuotasError(null);
      } catch (err: unknown) {
        console.error("Error fetching market quotas:", err);
        setQuotasError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoadingQuotas(false);
      }
    };

    fetchQuotas();
  }, []);

  return (
    <div className="border-1 p-3 rounded-md shadow-sm bg-white">
      <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-1">
        <LuFish />
        Quota Usage
      </h3>
      <div className="space-y-3">
        {/* Loading State */}
        {loadingQuotas && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Loading quotas data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {QuotasError && (
          <div>
            <div className="flex justify-between text-xs text-red-500 mb-1">
              <span>Error loading data: {QuotasError}</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!loadingQuotas &&
          !QuotasError &&
          (quotas.length === 0 ? (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>No quotas data available</span>
              </div>
            </div>
          ) : (
            quotas.map((item: QuotaApiItem, index: number) => (
              <div key={index}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>
                    {item.product_name}: {item.remaining_quota} used
                  </span>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default QuotaUsage;
