import EggsTableClient from "@/components/EggsTableClient";

interface EggData {
  number: number;
  date: string;
  house: string;
  totalEggs: number;
  mortality: number;
  brokenEggs: number;
  chickens: number;
  food: number;
  user: string;
  tray: number;
  percentage: number;
}

export default async function EggsPage({ searchParams }: { searchParams: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  let eggData: EggData[] = [];
  let error: string | null = null;

  // Fetch data
  try {
    const response = await fetch('http://localhost:3000/api/eggs');
    if (!response.ok) {
      throw new Error('Failed to fetch egg data from the API.');
    }
    eggData = await response.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "An unknown error occurred.";
    }
  }

  // Search logic
  const searchHouse = searchParams.searchHouse?.toLowerCase() || "";
  const searchDate = searchParams.searchDate || "";
  if (searchHouse || searchDate) {
    eggData = eggData.filter((item) => {
      return (
        (searchHouse && item.house.toLowerCase().includes(searchHouse)) ||
        (searchDate && item.date === searchDate)
      );
    });
  }

  // Filter logic
  const filterHouse = searchParams.filterHouse || "";
  const filterDateStart = searchParams.filterDateStart || "";
  const filterDateEnd = searchParams.filterDateEnd || "";
  if (filterHouse || filterDateStart || filterDateEnd) {
    eggData = eggData.filter((item) => {
      const date = new Date(item.date);
      const startDate = filterDateStart ? new Date(filterDateStart) : null;
      const endDate = filterDateEnd ? new Date(filterDateEnd) : null;
      return (
        (!filterHouse || item.house === filterHouse) &&
        (!startDate || date >= startDate) &&
        (!endDate || date <= endDate)
      );
    });
  }

  // Pagination logic
  const itemsPerPage = 8;
  const currentPage = parseInt(searchParams.page || "1", 10) || 1;
  const totalItems = eggData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = eggData.slice(startIndex, endIndex);

  // Unique houses for filter dropdown
  const uniqueHouses = Array.from(new Set(eggData.map((item) => item.house)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Pass data to client component */}
      <EggsTableClient
        paginatedData={paginatedData}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        searchHouse={searchHouse}
        searchDate={searchDate}
        filterHouse={filterHouse}
        filterDateStart={filterDateStart}
        filterDateEnd={filterDateEnd}
        uniqueHouses={uniqueHouses}
      />
    </div>
  );
}