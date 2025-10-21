import React, { useEffect, useState } from "react";
import { LuCircleDollarSign } from "react-icons/lu";

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

const MarketPrices = () => {
  const [marketPrices, setMarketPrices] = useState<ProcessedMarketPrice[]>([]);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(true);
  const [marketError, setMarketError] = useState<string | null>(null);

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

  const formatTrend = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatYoY = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="col-span-3 md:col-span-2 mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-4">
        <LuCircleDollarSign />
        <h3 className="text-sm font-medium text-gray-900">Market Prices</h3>
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
          <div className="text-red-500">Error loading data: {marketError}</div>
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
                      <div className="text-gray-900">{item.species_sku}</div>
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
                          item.yoy >= 0 ? "text-green-600" : "text-red-600"
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
  );
};

export default MarketPrices;
