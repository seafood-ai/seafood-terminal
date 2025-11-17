import React, { useEffect, useState } from "react";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaFilter } from "react-icons/fa6";
import { getToken } from "@/utils/lib/auth";

interface MarketPriceApiData {
  species_sku: string;
  origin: string;
  price: number;
  price_unit: string;
  weekly_trend: number;
  yoy: number;
}

interface MarketPriceApiItem {
  data: MarketPriceApiData[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface ProcessedMarketPriceData {
  species_sku: string;
  origin: string;
  price: string;
  weekly_trend: number;
  yoy: number;
}

interface ProcessedMarketPriceItem {
  data: ProcessedMarketPriceData[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface Filters {
  species: string;
  region: string;
}

const MarketPrices = () => {
  const [allData, setAllData] = useState<ProcessedMarketPriceData[]>([]);
  const [loadingMarket, setLoadingMarket] = useState<boolean>(true);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    species: "",
    region: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10; // Items per page

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    species: [] as string[],
    regions: [] as string[],
  });

  // Fetch all data once on mount
  useEffect(() => {
    const fetchAllMarketPrices = async () => {
      try {
        setLoadingMarket(true);

        // 1. Check localStorage for cached data
        const cached = localStorage.getItem("market_prices_cache");
        const cacheTime = localStorage.getItem("market_prices_cache_time");

        // optional: 10 minutes validity
        const CACHE_DURATION = 10 * 60 * 1000;

        if (
          cached &&
          cacheTime &&
          Date.now() - Number(cacheTime) < CACHE_DURATION
        ) {
          const parsed: ProcessedMarketPriceData[] = JSON.parse(cached);
          setAllData(parsed);
          // Extract unique filter options
          if (parsed.length > 0) {
            const uniqueSpecies = [
              ...new Set(parsed.map((item) => item.species_sku)),
            ].sort();
            const uniqueRegions = [
              ...new Set(parsed.map((item) => item.origin)),
            ].sort();

            setFilterOptions({
              species: uniqueSpecies,
              regions: uniqueRegions,
            });
          }
          setLoadingMarket(false);
          return;
        }

        // 2. No cache or cache expired → fetch new data
        const token = getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_MARKET_PRICES}?page_size=5000`,
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

        const data: MarketPriceApiItem = await response.json();

        // Process all data
        const processedData: ProcessedMarketPriceData[] =
          data.data && Array.isArray(data.data)
            ? data.data.map(
                (item: MarketPriceApiData): ProcessedMarketPriceData => ({
                  species_sku: item.species_sku,
                  origin: item.origin,
                  price: `€${item.price.toFixed(2)}/${item.price_unit}`,
                  weekly_trend: item.weekly_trend,
                  yoy: item.yoy,
                })
              )
            : [];

        // 3. Save data into cache for next reload
        localStorage.setItem(
          "market_prices_cache",
          JSON.stringify(processedData)
        );
        localStorage.setItem("market_prices_cache_time", Date.now().toString());

        setAllData(processedData);

        // Extract unique filter options
        if (processedData.length > 0) {
          const uniqueSpecies = [
            ...new Set(processedData.map((item) => item.species_sku)),
          ].sort();
          const uniqueRegions = [
            ...new Set(processedData.map((item) => item.origin)),
          ].sort();

          setFilterOptions({
            species: uniqueSpecies,
            regions: uniqueRegions,
          });
        }

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

    fetchAllMarketPrices();
  }, []);

  // Apply filters and pagination client-side
  const getFilteredAndPaginatedData = (): ProcessedMarketPriceItem => {
    // Apply filters
    let filteredData = allData;

    if (filters.species) {
      filteredData = filteredData.filter(
        (item) => item.species_sku === filters.species
      );
    }

    if (filters.region) {
      filteredData = filteredData.filter(
        (item) => item.origin === filters.region
      );
    }

    // Calculate pagination
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      page: currentPage,
      page_size: pageSize,
      total_count: totalCount,
      total_pages: totalPages,
    };
  };

  const marketPrices = getFilteredAndPaginatedData();

  const formatTrend = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatYoY = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    if (value == null) {
      return `${sign}0.0%`;
    }
    return `${sign}${value.toFixed(1)}%`;
  };

  const getPageNumbers = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= marketPrices.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      species: "",
      region: "",
    });
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <div className="col-span-3 md:col-span-2 mb-6 border-1 p-3 rounded-md shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LuCircleDollarSign />
          <h3 className="text-sm font-medium text-gray-900">Market Prices</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FaFilter className="text-xs" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Species Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Species/SKU
              </label>
              <select
                value={filters.species}
                onChange={(e) => handleFilterChange("species", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Species</option>
                {filterOptions.species.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Origin/Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Regions</option>
                {filterOptions.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

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
        <>
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
                {marketPrices.total_count === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No market price data available
                  </div>
                ) : (
                  marketPrices.data.map(
                    (item: ProcessedMarketPriceData, index: number) => (
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

          {/* Pagination Controls */}
          {marketPrices.total_count > 0 && (
            <div className="flex items-center justify-between px-2 py-3 border-t border-gray-200">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                Showing {(marketPrices.page - 1) * marketPrices.page_size + 1}{" "}
                to{" "}
                {Math.min(
                  marketPrices.page * marketPrices.page_size,
                  marketPrices.total_count
                )}{" "}
                of {marketPrices.total_count} results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={marketPrices.page === 1}
                  className="cursor-pointer px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  «
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers(
                    marketPrices.page,
                    marketPrices.total_pages
                  ).map((pageNum, idx) =>
                    pageNum === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(Number(pageNum))}
                        className={`cursor-pointer px-3 py-1 text-sm rounded border ${
                          marketPrices.page === pageNum
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(marketPrices.total_pages)}
                  disabled={marketPrices.page === marketPrices.total_pages}
                  className="cursor-pointer px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketPrices;
