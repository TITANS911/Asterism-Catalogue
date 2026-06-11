import SidebarAdmin from "../../../components/sidebarAdmin";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3001/api";

export default function OrderMangement() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: itemsPerPage,
    total_items: 0,
    total_pages: 1,
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const parseDateRange = (value) => {
    const text = String(value || "").trim();
    if (!text) return { startDate: "", endDate: "" };

    const matches = text.match(/\d{4}-\d{2}-\d{2}/g);
    if (!matches || matches.length === 0) return { startDate: "", endDate: "" };
    if (matches.length === 1)
      return { startDate: matches[0], endDate: matches[0] };

    return { startDate: matches[0], endDate: matches[1] };
  };

  const formatCurrency = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numeric);
  };

  const formatDateTime = (value) => {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapOrderStatusLabel = (status) => {
    if (status === "pending") return "Pending Payment";
    if (status === "processing") return "Processing";
    if (status === "shipped") return "Shipped";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return String(status || "-");
  };

  // Fungsi untuk mendapatkan style status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending Payment":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Processing":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-600 border border-purple-200";
      case "Completed":
        return "bg-green-50 text-green-600 border border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const paymentMethodOptions = useMemo(() => {
    const list = Array.isArray(stats?.payment_methods)
      ? stats.payment_methods
      : [];
    return list;
  }, [stats]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/stats`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil statistik order");
      }

      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error(err);
      setStats(null);
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(itemsPerPage));
      params.set("exclude_payment_status", "failed");

      if (selectedStatus) params.set("status", selectedStatus);
      if (selectedPaymentMethod)
        params.set("payment_method", selectedPaymentMethod);
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);

      const { startDate, endDate } = parseDateRange(dateRange);
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);

      const response = await fetch(`${API_URL}/orders?${params.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data order");
      }

      const fetchedOrders = Array.isArray(result.data?.orders)
        ? result.data.orders
        : [];
      setOrders(fetchedOrders);

      const nextPagination = result.data?.pagination || null;
      if (nextPagination) {
        setPagination(nextPagination);
        setCurrentPage(nextPagination.current_page || 1);
      } else {
        setPagination({
          current_page: page,
          per_page: itemsPerPage,
          total_items: fetchedOrders.length,
          total_pages: 1,
        });
        setCurrentPage(page);
      }
    } catch (err) {
      setOrders([]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchOrders(1);
  }, [debouncedSearchTerm, selectedStatus, selectedPaymentMethod, dateRange]);

  const totalPages = pagination?.total_pages || 1;
  const totalItems = pagination?.total_items || 0;
  const showingFrom =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(totalItems, currentPage * itemsPerPage);

  const pageButtons = useMemo(() => {
    const pages = [];
    const total = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, currentPage), total);

    const push = (value) => pages.push(value);

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) push(i);
      return pages;
    }

    push(1);
    if (current > 3) push("ellipsis-left");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i += 1) push(i);

    if (current < total - 2) push("ellipsis-right");
    push(total);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="orders" />

      <div className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-black mb-0.5">
              Order Management
            </h1>
            <p className="text-gray-400 text-xs">
              View and manage all customer orders.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold">
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Report
          </button>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {stats?.total_orders ?? "-"}
                </p>
                <p className="text-gray-400 text-[10px]">All orders in store</p>
              </div>
              <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Pending Payment
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {stats?.pending_payment ?? "-"}
                </p>
                <p className="text-gray-400 text-[10px]">Awaiting payment</p>
              </div>
              <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Processing
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {stats?.processing ?? "-"}
                </p>
                <p className="text-gray-400 text-[10px]">Being prepared</p>
              </div>
              <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Shipped
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {stats?.shipped ?? "-"}
                </p>
                <p className="text-gray-400 text-[10px]">On the way</p>
              </div>
              <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h4m4-12h4a1 1 0 011 1v10a1 1 0 01-1 1h-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Completed
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {stats?.completed ?? "-"}
                </p>
                <p className="text-gray-400 text-[10px]">
                  Successfully delivered
                </p>
              </div>
              <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center flex-shrink-0">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 rounded-md border border-gray-300 mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Search order ID, customer name..."
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending Payment</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">All Payment Method</option>
              {paymentMethodOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filter by date range..."
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel Order */}
        <div className="bg-white rounded-md border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-xs text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-xs text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-xs text-gray-400"
                    >
                      Tidak ada order yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const displayStatus = mapOrderStatusLabel(
                      order.order_status,
                    );
                    const displayPaymentMethod = order.payment_method || "-";
                    const itemCount = Array.isArray(order.items)
                      ? order.items.length
                      : 0;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Link
                            to={`/ecommerce/admin/orders/${order.id}`}
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div>
                            <p className="text-xs font-semibold text-black">
                              {order.customer_name || "-"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {order.customer_email || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                          {formatDateTime(order.created_at)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div>
                            <p className="text-xs font-semibold text-black">
                              {formatCurrency(order.total)}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-black">
                          {displayPaymentMethod}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${getStatusStyle(
                              displayStatus,
                            )}`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Link
                              to={`/ecommerce/admin/orders/${order.id}`}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <svg
                                className="w-3.5 h-3.5 text-gray-600"
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
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {showingFrom} to {showingTo} of {totalItems} orders
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => fetchOrders(currentPage - 1)}
            >
              <svg
                className="w-3.5 h-3.5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {pageButtons.map((page) =>
              String(page).startsWith("ellipsis") ? (
                <span key={page} className="text-xs text-gray-400 px-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${
                    page === currentPage
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:bg-gray-100 text-gray-600"
                  }`}
                  disabled={isLoading}
                  onClick={() => fetchOrders(page)}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => fetchOrders(currentPage + 1)}
            >
              <svg
                className="w-3.5 h-3.5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
