import React from 'react';

const Report = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500">Overviewing your store performance and sales analytics</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">↓</span> Export Report
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { title: "Total Revenue", val: "Rp15.400.000" },
          { title: "Total Orders", val: "20" },
          { title: "Products Sold", val: "20" },
          { title: "Total Customers", val: "20" },
          { title: "Average Order Value", val: "Rp124.990" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{item.title}</p>
            <h3 className="text-lg font-bold mt-1">{item.val}</h3>
            <p className="text-green-500 text-xs font-semibold mt-2">▲ 12,5% <span className="text-gray-400">vs last week</span></p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64">
          <h2 className="font-semibold mb-4">Sales Overview</h2>
          {/* Tempatkan Chart Library seperti Chart.js atau Recharts di sini */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          {/* Donut Chart Component */}
        </div>
      </div>

      {/* Bottom Data Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4">Top Selling Products</h2>
          {/* Table list here */}
        </div>
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4">Revenue by Category</h2>
          {/* Pie/Donut Chart */}
        </div>
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4">Sales Summary</h2>
          {/* List stats */}
        </div>
      </div>
    </div>
  );
};

export default Report;