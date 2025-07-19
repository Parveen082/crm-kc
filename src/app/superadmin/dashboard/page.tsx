'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const LoanDashboard = () => {
  const [userData, setUserData] = useState({
    userCount: 0,
    users2Count: 0,
    totalUsers: 0,
  });
  const [analysisData, setAnalysisData] = useState({
    validUsers: 0,
    invalidUsers: 0,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch user data from API
  const fetchUserData = async () => {
    if (!token) {
      toast.error('No token found in localStorage.');
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/get/all/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({
          userCount: data.userCount || 0,
          users2Count: data.users2Count || 0,
          totalUsers: data.totalUsers || 0,
        });
      } else {
        toast.error(data.message || 'Failed to fetch user data.');
      }
    } catch {
      toast.error('Error fetching user data');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAnalysisData();
  }, []);
  const fetchAnalysisData = async () => {
    if (!token) {
      toast.error('No token found in localStorage.');
      return;
    }

    try {
      const res = await fetch('https://keshvacredit.com/api/v1/admin/analysis', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisData({
          validUsers: data.validUsers || 0,
          invalidUsers: data.invalidUsers || 0,
        });
      } else {
        toast.error(data.message || 'Failed to fetch analysis data.');
      }
    } catch {
      toast.error('Error fetching analysis data');
    }
  };

  const loanDistributionData = [
    { name: 'Web Users...', value: userData.userCount },
    { name: 'Old Users', value: userData.users2Count },
  ];
  // Sample data for other charts
  const repaymentStatusData = [
    { month: 'Jan', current: 120, delinquent: 10, defaulted: 5 },
    { month: 'Feb', current: 150, delinquent: 12, defaulted: 3 },
    { month: 'Mar', current: 180, delinquent: 8, defaulted: 2 },
    { month: 'Apr', current: 200, delinquent: 15, defaulted: 4 },
    { month: 'May', current: 220, delinquent: 18, defaulted: 6 },
    { month: 'Jun', current: 250, delinquent: 20, defaulted: 5 },
  ];

  const loanAmountByType = [
    { type: 'Personal', amount: 500000, count: 35 },
    { type: 'Mortgage', amount: 1200000, count: 25 },
    { type: 'Auto', amount: 800000, count: 20 },
    { type: 'Business', amount: 900000, count: 15 },
    { type: 'Education', amount: 200000, count: 5 },
  ];


  const portfolioGrowth = [
    { quarter: 'Q1', amount: 1000, uv: 400 },
    { quarter: 'Q2', amount: 1200, uv: 600 },
    { quarter: 'Q3', amount: 1500, uv: 800 },
    { quarter: 'Q4', amount: 1800, uv: 700 },
    { quarter: 'Q1', amount: 2000, uv: 900 },
    { quarter: 'Q2', amount: 2200, uv: 1000 },
  ];


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Total Users</h3>
            <p className="text-2xl font-bold text-blue-400">{userData.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Old Users</h3>
            <p className="text-2xl font-bold text-pink-600">{(userData.users2Count - userData.userCount).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Website Users</h3>
            <p className="text-2xl font-bold text-green-600">{userData.userCount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Valid Users</h3>
            <p className="text-2xl font-bold text-amber-500">
              {analysisData.validUsers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Invalid Users</h3>
            <p className="text-2xl font-bold text-amber-500">
              {analysisData.invalidUsers.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lender Lead Summary</h2>
          <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Sr. No</th>
                <th className="px-6 py-3 text-left">Lender Name</th>
                <th className="px-6 py-3 text-left">Total Leads Sent</th>
                <th className="px-6 py-3 text-left">Successful Leads</th>
                <th className="px-6 py-3 text-left">Dedupe Leads</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 divide-y divide-gray-200">
              {[
                {
                  lender: 'money view',
                  total: 1200,
                  success: 950,
                  dedupe: 50,
                },
                {
                  lender: 'Ramfin',
                  total: 1100,
                  success: 870,
                  dedupe: 40,
                },
                {
                  lender: 'olyv',
                  total: 900,
                  success: 780,
                  dedupe: 30,
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.lender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                    {row.success.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-500 font-medium">
                    {row.dedupe.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
          {/* Chart 1: User Distribution Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : `${name} 0%`
                    }
                  >
                    {loanDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">User Validation Summary</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Valid Users', count: analysisData.validUsers },
                    { name: 'Invalid Users', count: analysisData.invalidUsers },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="User Count" fill="#8884d8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>



          {/* Chart 2: Repayment Status Area Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Repayment Status (Last 6 Months)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={repaymentStatusData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="current" stackId="1" stroke="#8884d8" fill="#8884d8" name="Current" />
                  <Area type="monotone" dataKey="delinquent" stackId="1" stroke="#ffc658" fill="#ffc658" name="Delinquent" />
                  <Area type="monotone" dataKey="defaulted" stackId="1" stroke="#ff8042" fill="#ff8042" name="Defaulted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Loan Amount by Type Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Loan Amount by Type</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanAmountByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" name="Total Amount ($)" fill="#82ca9d" />
                  <Bar dataKey="count" name="Number of Loans" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Customer Demographics Bar Chart */}


          {/* Chart 5: Portfolio Growth Area Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Portfolio Growth (2025)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={730}
                  height={250}
                  data={portfolioGrowth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="50%" stopColor="#00C49F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* Axes and Grid */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {/* Chart Areas */}
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#00C49F"
                    fill="url(#colorUv)"
                    name="Portfolio Value ($)"
                  />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="url(#colorPv)"
                    name="UV Metric"
                  />
                </AreaChart>

              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;