'use client';

import EggsTableClient from "@/components/EggsTableClient";
import Header from "@/components/Header";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

export default function EggsPage() {
  const [eggData, setEggData] = useState<EggData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3000/api/eggs');
        if (!response.ok) {
          throw new Error('Failed to fetch egg data from the API.');
        }
        const data: EggData[] = await response.json();

        console.log("eggs data is here ", JSON.stringify(data));
        setEggData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }

    fetchData();
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/dashboard/login' });
  };

  // Search and Filter Logic
  const searchHouse = searchParams.get('searchHouse')?.toLowerCase() || "";
  const searchDate = searchParams.get('searchDate') || "";
  const filterHouse = searchParams.get('filterHouse') || "";
  const filterDateStart = searchParams.get('filterDateStart') || "";
  const filterDateEnd = searchParams.get('filterDateEnd') || "";

  const filteredEggData = eggData.filter((item) => {
    const isHouseMatch = !searchHouse || item.house.toLowerCase().includes(searchHouse);
    const isDateMatch = !searchDate || item.date === searchDate;
    const isFilterHouseMatch = !filterHouse || item.house === filterHouse;

    let isDateInRange = true;
    if (filterDateStart || filterDateEnd) {
      const itemDate = new Date(item.date);
      const startDate = filterDateStart ? new Date(filterDateStart) : null;
      const endDate = filterDateEnd ? new Date(filterDateEnd) : null;
      isDateInRange = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    }

    return isHouseMatch && isDateMatch && isFilterHouseMatch && isDateInRange;
  });

  // Pagination Logic
  const itemsPerPage = 8;
  const currentPage = parseInt(searchParams.get('page') || "1", 10) || 1;
  const totalItems = filteredEggData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredEggData.slice(startIndex, endIndex);

  // Unique Houses (from filtered data)
  const uniqueHouses = Array.from(new Set(filteredEggData.map((item) => item.house)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header onSignOut={handleSignOut} />
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
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