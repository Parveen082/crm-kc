'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const LoanDashboard = () => {
  // Sample data for the charts
  const loanDistributionData = [
    { name: 'Personal', value: 35 },
    { name: 'Mortgage', value: 25 },
    { name: 'Auto', value: 20 },
    { name: 'Business', value: 15 },
    { name: 'Education', value: 5 },
  ];

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

  const customerDemographics = [
    { age: '18-25', count: 15 },
    { age: '26-35', count: 40 },
    { age: '36-45', count: 30 },
    { age: '46-55', count: 10 },
    { age: '56+', count: 5 },
  ];

  const portfolioGrowth = [
    { quarter: 'Q1', amount: 2500000 },
    { quarter: 'Q2', amount: 3200000 },
    { quarter: 'Q3', amount: 3800000 },
    { quarter: 'Q4', amount: 4500000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Loan Portfolio Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Total Loans</h3>
            <p className="text-2xl font-bold text-blue-400">$4.5M</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Active Customers</h3>
            <p className="text-2xl font-bold text-pink-600">1,250</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Current Rate</h3>
            <p className="text-2xl font-bold text-green-600">92.5%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold">Delinquency</h3>
            <p className="text-2xl font-bold text-amber-500">7.5%</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Loan Distribution Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Loan Type Distribution</h2>
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
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Customer Age Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerDemographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Customers" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Portfolio Growth Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Portfolio Growth (2025)</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Portfolio Value ($)"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;