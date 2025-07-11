"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BarChart, CreditCard, Users, LineChart } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get("admin_login");
    if (!isLoggedIn) {
      router.push("/Admin-panel-login");
    }
  }, [router]);

  const stats = [
    {
      label: "Total Users",
      value: "1,245",
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Revenue",
      value: "₹1,20,000",
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
    },
    {
      label: "New Leads",
      value: "87",
      icon: <BarChart className="w-6 h-6 text-yellow-600" />,
    },
    {
      label: "Active Loans",
      value: "52",
      icon: <LineChart className="w-6 h-6 text-red-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white rounded-2xl shadow text-center text-gray-600">
        <p>Analytics and charts will be added here.</p>
      </div>
    </div>
  );
}
