import React, { useEffect, useState } from "react";
import { FaArrowTrendUp, FaFilter } from "react-icons/fa6";

interface LandingsApiData {
  year: number;
  region: string;
  nmfs_name: string;
  pounds: number;
  dollars: number;
  metric_tons: number;
}

interface LandingsApiItem {
  data: LandingsApiData[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface ProcessedLandingData {
  species: string;
  volume: string;
  avgPrice: string;
  port: string;
  date: string;
}

interface ProcessedLandingItem {
  data: ProcessedLandingData[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface Filters {
  year: string;
  region: string;
  name: string;
}

const Landings = () => {
  const [landings, setLandings] = useState<ProcessedLandingItem>({
    data: [],
    page: 1,
    page_size: 0,
    total_count: 0,
    total_pages: 0,
  });
  const [loadingLandings, setLoadingLandings] = useState<boolean>(true);
  const [landingsError, setLandingsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    year: "",
    region: "",
    name: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options (you can fetch these dynamically or hardcode)
  const [filterOptions, setFilterOptions] = useState({
    years: [] as string[],
    regions: [] as string[],
    species: [] as string[],
  });

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch a large sample to get unique values
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_LANDINGS}?page=1&page_size=5000`
        );
        const data: LandingsApiItem = await response.json();

        // Extract unique values
        const uniqueYears = [
          ...new Set(data.data.map((item) => item.year.toString())),
        ].sort((a, b) => Number(b) - Number(a));
        const uniqueRegions = [
          ...new Set(data.data.map((item) => item.region)),
        ].sort();
        const uniqueSpecies = [
          ...new Set(data.data.map((item) => item.nmfs_name)),
        ].sort();

        setFilterOptions({
          years: uniqueYears,
          regions: uniqueRegions,
          species: uniqueSpecies,
        });
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchLandings = async (pageNumber: number) => {
      try {
        setLoadingLandings(true);

        // Build query string with filters
        let queryParams = `page=${pageNumber}`;
        if (filters.year) queryParams += `&year=${filters.year}`;
        if (filters.region)
          queryParams += `&region=${encodeURIComponent(filters.region)}`;
        if (filters.name)
          queryParams += `&name=${encodeURIComponent(filters.name)}`;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_LANDINGS}?${queryParams}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LandingsApiItem = await response.json();

        // Handle null or empty data
        const processedData: ProcessedLandingData[] =
          data.data && Array.isArray(data.data)
            ? data.data.map((item: LandingsApiData): ProcessedLandingData => {
                const avgPricePerPound =
                  item.pounds > 0 ? item.dollars / item.pounds : 0;

                const speciesName = item.nmfs_name
                  .replace(/\*\*/g, "")
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
                  avgPrice: `${avgPricePerPound.toFixed(2)}`,
                  port: item.region,
                  date: displayDate,
                };
              })
            : [];

        setLandings({
          data: processedData,
          page: data.page || 1,
          page_size: data.page_size || 0,
          total_count: data.total_count || 0,
          total_pages: data.total_pages || 0,
        });
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

    fetchLandings(currentPage);
  }, [currentPage, filters]);

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
    if (newPage >= 1 && newPage <= landings.total_pages) {
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
      year: "",
      region: "",
      name: "",
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
          <FaArrowTrendUp />
          <h3 className="text-sm font-medium text-gray-900">
            Auctions & Landings
          </h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Year Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {filterOptions.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Region
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

            {/* Species Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Species
              </label>
              <select
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Species</option>
                {filterOptions.species.map((species) => (
                  <option key={species} value={species}>
                    {species.replace(/\*\*/g, "")}
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
      {loadingLandings && (
        <div className="flex items-center justify-center py-8 h-100">
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
        <>
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
                {landings.total_count === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No landings data available
                  </div>
                ) : (
                  landings.data.map(
                    (item: ProcessedLandingData, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 gap-4 py-1 text-sm border-b border-gray-200"
                      >
                        <div className="text-gray-900">{item.species}</div>
                        <div className="text-gray-700">{item.volume}</div>
                        <div className="text-gray-700">${item.avgPrice}</div>
                        <div className="text-gray-700">{item.port}</div>
                        <div className="text-gray-700">{item.date}</div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {landings.total_count > 0 && (
            <div className="flex items-center justify-between px-2 py-3 border-t border-gray-200">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                Showing {(landings.page - 1) * landings.page_size + 1} to{" "}
                {Math.min(
                  landings.page * landings.page_size,
                  landings.total_count
                )}{" "}
                of {landings.total_count} results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={landings.page === 1}
                  className="cursor-pointer px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  «
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers(landings.page, landings.total_pages).map(
                    (pageNum, idx) =>
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
                            landings.page === pageNum
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
                  onClick={() => handlePageChange(landings.total_pages)}
                  disabled={landings.page === landings.total_pages}
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

export default Landings;
