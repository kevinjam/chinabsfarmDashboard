"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import the autotable plugin and types
import * as XLSX from "xlsx";

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

interface EggsTableClientProps {
  paginatedData: EggData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchHouse: string;
  searchDate: string;
  filterHouse: string;
  filterDateStart: string;
  filterDateEnd: string;
  uniqueHouses: string[];
}

export default function EggsTableClient({
  paginatedData,
  totalItems,
  totalPages,
  currentPage,
  searchHouse,
  searchDate,
  filterHouse,
  filterDateStart,
  filterDateEnd,
  uniqueHouses,
}: EggsTableClientProps) {
  const tableRef = useRef<HTMLTableElement>(null);

  // PDF Download Handler
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Chinabs Farm = Eggs Data", 10, 10);

    // Define table columns and rows
    const columns = [
      "Number",  
      "Date",
      "House",
      "Total Eggs",
      "Mortality",
      "Broken Eggs",
      "Chickens",
      "Food",
      "User",
      "Tray",
      "Percentage",
    ];
    const rows = paginatedData.map((row) => [
      row.number,
      row.date,
      row.house,
      row.totalEggs,
      row.mortality,
      row.brokenEggs,
      row.chickens,
      row.food,
      row.user,
      row.tray,
      row.percentage,
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20, // Start below the title
    });

    doc.save("eggs-data.pdf");
  };

  // Excel Download Handler
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(paginatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chinabs Farm = Eggs Data");
    XLSX.writeFile(workbook, "eggs-data.xlsx");
  };

  console.log("000000 paginatedData", paginatedData);
  console.log("totalItems", totalItems);
  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <form id="searchForm" method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by House */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by House
            </label>
            <input
              type="text"
              name="searchHouse"
              defaultValue={searchHouse}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter house name"
            />
          </div>

          {/* Search by Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Date
            </label>
            <input
              type="date"
              name="searchDate"
              defaultValue={searchDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Search */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by House
            </label>
            <select
              name="filterHouse"
              defaultValue={filterHouse}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Houses</option>
              {uniqueHouses.map((house) => (
                <option key={house} value={house}>
                  {house}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="filterDateStart"
              defaultValue={filterDateStart}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="filterDateEnd"
              defaultValue={filterDateEnd}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </form>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Print
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download PDF
        </button>
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Download Excel
        </button>
      </div>

      {/* Eggs Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                House
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Eggs
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mortality
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broken Eggs
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chickens
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Food
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tray
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{row.number}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.house}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.totalEggs}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.mortality}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.brokenEggs}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.chickens}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.food}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.user}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.tray}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{row.percentage}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-4 px-6 text-sm text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * 15 + 1, totalItems)} to{" "}
            {Math.min(currentPage * 15, totalItems)} of {totalItems} entries
          </div>
          <div className="flex space-x-2">
            <a
              href={`?page=${currentPage - 1}&searchHouse=${searchHouse}&searchDate=${searchDate}&filterHouse=${filterHouse}&filterDateStart=${filterDateStart}&filterDateEnd=${filterDateEnd}`}
              className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
            >
              Previous
            </a>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`?page=${page}&searchHouse=${searchHouse}&searchDate=${searchDate}&filterHouse=${filterHouse}&filterDateStart=${filterDateStart}&filterDateEnd=${filterDateEnd}`}
                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </a>
            ))}
            <a
              href={`?page=${currentPage + 1}&searchHouse=${searchHouse}&searchDate=${searchDate}&filterHouse=${filterHouse}&filterDateStart=${filterDateStart}&filterDateEnd=${filterDateEnd}`}
              className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ pointerEvents: currentPage === totalPages ? "none" : "auto" }}
            >
              Next
            </a>
          </div>
        </div>
      )}
    </>
  );
}