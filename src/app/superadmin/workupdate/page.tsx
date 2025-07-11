"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserData {
  name: string;
  department: string;
  message: string;
  createdAt: string;
  time: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination & search states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    const isLoggedIn = Cookies.get("admin_login");
    if (!isLoggedIn) {
      router.push("/Admin-panel-login");
    }
  }, [router]);

  // Fetch all data initially (daily report)
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://keshvacredit.com/api/v1/employee/getDailyReport"
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      const users: UserData[] = data.data || data;
      setUserData(users);
      setCurrentPage(1); // Reset page on new fetch
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with API POST
  const handleSearch = async () => {
    if (!searchName.trim()) {
      // If empty search, reload all data
      fetchUserData();
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://keshvacredit.com/api/v1/employee/getUserReport",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: searchName.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      const users: UserData[] = data.data || data;
      setUserData(users);
      setCurrentPage(1); // Reset page on new search
    } catch (error) {
      console.error("Error searching user data:", error);
      setUserData([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(userData.length / rowsPerPage);
  const currentData = userData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Handle change in rows per page selector
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on page size change
  };

  // Handle search input Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Daily Work Report</h1>
      </div>

      {/* Search and page size controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchName("");
              fetchUserData();
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="font-semibold">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="admin-box shadow rounded p-4 bg-white ">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="text-blue-500 text-2xl"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
              </svg>
            </div>
            <div className="ml-2">
  <h2 className="text-sm font-semibold">Total Messages</h2>
  <p className="text-lg font-bold">
    {loading ? "Loading..." : userData.length}
  </p>
</div>

          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading data...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.department}</td>
                  <td className="px-6 py-4">{user.message}</td>
                  <td className="px-6 py-4">{user.createdAt}</td>
                  <td className="px-6 py-4">{user.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-3 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded hover:bg-gray-300 ${
                currentPage === page
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
