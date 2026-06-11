import SidebarAdmin from "../../../components/sidebarAdmin";
import { Link } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="dashboard" />

      <div className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-black mb-0.5">
              Welcome Back, Admin!
            </h1>
            <p className="text-gray-400 text-xs">
              Here's what happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/ecommerce"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Store
            </Link>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-semibold text-black">
                31 May 2026
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  Rp5.990.987
                </p>
                <div className="flex items-center gap-1.5 text-green-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                  <span className="font-semibold text-[9px]">12,5%</span>
                  <span className="text-gray-400 text-[9px]">vs last week</span>
                </div>
              </div>
              <div className="w-7 h-7 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">20</p>
                <div className="flex items-center gap-1.5 text-green-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                  <span className="font-semibold text-[9px]">12,5%</span>
                  <span className="text-gray-400 text-[9px]">vs last week</span>
                </div>
              </div>
              <div className="w-7 h-7 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">5</p>
                <div className="flex items-center gap-1.5 text-green-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                  <span className="font-semibold text-[9px]">12,5%</span>
                  <span className="text-gray-400 text-[9px]">vs last week</span>
                </div>
              </div>
              <div className="w-7 h-7 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">4</p>
                <div className="flex items-center gap-1.5 text-green-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                  <span className="font-semibold text-[9px]">12,5%</span>
                  <span className="text-gray-400 text-[9px]">vs last week</span>
                </div>
              </div>
              <div className="w-7 h-7 border border-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2">
              Sales Overview
            </h3>
            <div className="h-36 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <svg
                  className="w-6 h-6 mx-auto mb-1 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-400 text-[7px]">
                  Sales Chart Placeholder
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2">
              Orders by Status
            </h3>
            <div className="h-64 flex flex-col justify-center">
              <div className="flex items-center gap-5">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full transform -rotate-90"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="6"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="6"
                      strokeDasharray="70.37 14.19"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="6"
                      strokeDasharray="10.05 86.49"
                      strokeDashoffset="-70.37"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="6"
                      strokeDasharray="10.05 86.49"
                      strokeDashoffset="-80.42"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="6"
                      strokeDasharray="10.05 86.49"
                      strokeDashoffset="-90.47"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">Total</p>
                      <p className="text-2xl font-bold text-black">20</p>
                      <p className="text-sm text-gray-600 font-medium">
                        Orders
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <span className="text-black text-xs flex-1">Pending</span>
                    <span className="font-semibold text-gray-600 text-xs">
                      1
                    </span>
                    <span className="font-semibold text-gray-400 text-xs ml-1">
                      10%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="text-black text-xs flex-1">
                      Processing
                    </span>
                    <span className="font-semibold text-gray-600 text-xs">
                      1
                    </span>
                    <span className="font-semibold text-gray-400 text-xs ml-1">
                      10%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-black text-xs flex-1">Shipped</span>
                    <span className="font-semibold text-gray-600 text-xs">
                      1
                    </span>
                    <span className="font-semibold text-gray-400 text-xs ml-1">
                      10%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                    <span className="text-black text-xs flex-1">Completed</span>
                    <span className="font-semibold text-gray-600 text-xs">
                      3
                    </span>
                    <span className="font-semibold text-gray-400 text-xs ml-1">
                      70%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2 bg-white rounded-md border border-gray-300">
            <div className="px-3 pt-3 pb-1.5">
              <h3 className="text-sm font-semibold text-black">
                Recent Orders
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-medium text-black">
                      ASTR-290526-0001
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Nur Hikma Missgyarti
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-gray-600">
                      29 May 2026, 20:31
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp99.900
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Bank Transfer (Mandiri)
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="px-1 py-0.5 text-[7px] font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                        Pending Payment
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-medium text-black">
                      ASTR-290526-0001
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Nur Hikma Missgyarti
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-gray-600">
                      29 May 2026, 20:31
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp99.900
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Bank Transfer (Mandiri)
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="px-1 py-0.5 text-[7px] font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        Processing
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-medium text-black">
                      ASTR-290526-0001
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Nur Hikma Missgyarti
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-gray-600">
                      29 May 2026, 20:31
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp99.900
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Bank Transfer (Mandiri)
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="px-1 py-0.5 text-[7px] font-semibold rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                        Shipped
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-medium text-black">
                      ASTR-290526-0001
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Nur Hikma Missgyarti
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-gray-600">
                      29 May 2026, 20:31
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp99.900
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Bank Transfer (Mandiri)
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="px-1 py-0.5 text-[7px] font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-medium text-black">
                      ASTR-290526-0001
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Nur Hikma Missgyarti
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-gray-600">
                      29 May 2026, 20:31
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp99.900
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] text-black">
                      Bank Transfer (Mandiri)
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="px-1 py-0.5 text-[7px] font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-300">
            <div className="px-3 pt-3 pb-1.5">
              <h3 className="text-sm font-semibold text-black">
                Top Selling Products
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Sold
                    </th>
                    <th className="px-3 py-1.5 text-left text-[7px] font-semibold text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-bold text-black">
                      1
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                          🧦
                        </div>
                        <div>
                          <p className="text-[7px] font-semibold text-black">
                            Asterism Socks - Midnight Black
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      3
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp150.000
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-bold text-black">
                      2
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                          🧦
                        </div>
                        <div>
                          <p className="text-[7px] font-semibold text-black">
                            Asterism Socks - Midnight Black
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      3
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp150.000
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-bold text-black">
                      3
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                          🧦
                        </div>
                        <div>
                          <p className="text-[7px] font-semibold text-black">
                            Asterism Socks - Midnight Black
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      3
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp150.000
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-bold text-black">
                      4
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                          🧦
                        </div>
                        <div>
                          <p className="text-[7px] font-semibold text-black">
                            Asterism Socks - Midnight Black
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      3
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-[7px] font-semibold text-black">
                      Rp150.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
