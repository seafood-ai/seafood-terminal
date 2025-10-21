import React, { useEffect, useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

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

const Landings = () => {
  const [landings, setLandings] = useState<ProcessedLanding[]>([]);
  const [loadingLandings, setLoadingLandings] = useState<boolean>(true);
  const [landingsError, setLandingsError] = useState<string | null>(null);

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

  return (
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
                landings.map((item: ProcessedLanding, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 py-1 text-sm border-b border-gray-200"
                  >
                    <div className="text-gray-900">{item.species}</div>
                    <div className="text-gray-700">{item.volume}</div>
                    <div className="text-gray-700">{item.avgPrice}</div>
                    <div className="text-gray-700">{item.port}</div>
                    <div className="text-gray-700">{item.date}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landings;
