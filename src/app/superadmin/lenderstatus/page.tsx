"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function MoneyViewStatus() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedPhone = Cookies.get("phone");
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const checkStatus = async () => {
    if (!phone) return alert("Please enter a phone number");

    setLoading(true);
    try {
      const response = await axios.post("https://example.com/api/moneyview/status", {
        phone,
      });

      // Sample structure: { status: "Approved" }
      setStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">user Application Status</h1>

        <input
          type="tel"
          className="border w-full p-2 rounded mb-4"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={checkStatus}
          className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>

        {status && (
          <div className="mt-6 text-center">
            <p className="text-lg font-medium">Status:</p>
            <p
              className={`text-xl font-bold ${
                status === "Approved"
                  ? "text-green-600"
                  : status === "Rejected"
                  ? "text-red-600"
                  : status === "Pending"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
