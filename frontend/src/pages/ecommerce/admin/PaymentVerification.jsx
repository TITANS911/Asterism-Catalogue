import SidebarAdmin from "../../../components/sidebarAdmin";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3001/api";
const API_BASE_URL = "http://localhost:3001";

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "-";
  return `Rp ${numeric.toLocaleString("id-ID")}`;
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

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  return path;
};

const mapVerificationStatusLabel = (paymentStatus) => {
  if (paymentStatus === "paid") return "Approved";
  if (paymentStatus === "failed") return "Rejected";
  if (paymentStatus === "refunded") return "Refunded";
  return "Pending";
};

export default function PaymentVerification() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [stats, setStats] = useState({
    total_orders: 0,
    pending_payment: 0,
    approved_payment: 0,
    rejected_payment: 0,
    payment_methods: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
  });

  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Approved":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border border-red-200";
      case "Refunded":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/orders/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil statistik payment.");
    }
    if (result.success) {
      setStats({
        total_orders: Number(result.data?.total_orders || 0),
        pending_payment: Number(result.data?.pending_payment || 0),
        approved_payment: Number(result.data?.approved_payment || 0),
        rejected_payment: Number(result.data?.rejected_payment || 0),
        payment_methods: Array.isArray(result.data?.payment_methods)
          ? result.data.payment_methods
          : [],
      });
    }
  };

  const fetchOrders = async (page = 1) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pagination.per_page || 10));
    if (selectedPaymentStatus)
      params.set("payment_status", selectedPaymentStatus);
    if (selectedPaymentMethod)
      params.set("payment_method", selectedPaymentMethod);
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);

    const response = await fetch(`${API_URL}/orders?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data order.");
    }

    const nextOrders = Array.isArray(result.data?.orders)
      ? result.data.orders
      : [];
    const nextPagination = result.data?.pagination || null;
    setOrders(nextOrders);

    if (nextPagination) {
      setPagination({
        current_page: Number(nextPagination.current_page || 1),
        per_page: Number(nextPagination.per_page || 10),
        total_items: Number(nextPagination.total_items || 0),
        total_pages: Number(nextPagination.total_pages || 1),
      });
    }

    setSelectedOrderId((prevSelectedId) => {
      if (
        prevSelectedId &&
        nextOrders.some((order) => order.id === prevSelectedId)
      ) {
        return prevSelectedId;
      }
      return nextOrders[0]?.id || null;
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchStats();
        await fetchOrders(1);
      } catch (err) {
        setError(err.message);
        setOrders([]);
        setSelectedOrderId(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedPaymentMethod, selectedPaymentStatus, debouncedSearchTerm]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );

  const handleRejectPayment = async () => {
    if (!selectedOrder || actionLoading) return;

    if (!window.confirm("Reject payment untuk order ini?")) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/orders/${selectedOrder.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_status: "failed",
            order_status: "cancelled",
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal reject payment.");
      }

      if (result.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === result.data?.id ? result.data : order,
          ),
        );
        await fetchStats();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.max(1, Number(pagination.total_pages || 1));
  const currentPage = Math.min(
    Math.max(1, Number(pagination.current_page || 1)),
    totalPages,
  );
  const totalItems = Number(pagination.total_items || 0);
  const perPage = Number(pagination.per_page || 10);
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, totalItems);

  const pageButtons = useMemo(() => {
    const pages = [];
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) pages.push("ellipsis-left");
    for (let i = left; i <= right; i += 1) pages.push(i);
    if (right < totalPages - 1) pages.push("ellipsis-right");

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex">
      <SidebarAdmin activePage="payment" />

      <div className="flex-1 ml-64">
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-lg font-bold text-black mb-0.5">
                Payment Verification
              </h1>
              <p className="text-gray-400 text-[11px]">
                Review and verify customer payments.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
            <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                    Pending Verification
                  </p>
                  <p className="text-2xl font-bold text-black mb-0.5">
                    {stats.pending_payment}
                  </p>
                  <p className="text-gray-400 text-[8px]">Payments to review</p>
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-black mb-0.5">
                    {stats.approved_payment}
                  </p>
                  <p className="text-gray-400 text-[8px]">This month</p>
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

            <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                    Rejected
                  </p>
                  <p className="text-2xl font-bold text-black mb-0.5">
                    {stats.rejected_payment}
                  </p>
                  <p className="text-gray-400 text-[8px]">This month</p>
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0h-2m2 0V5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                    Total Verified
                  </p>
                  <p className="text-2xl font-bold text-black mb-0.5">
                    {stats.approved_payment + stats.rejected_payment}
                  </p>
                  <p className="text-gray-400 text-[8px]">This month</p>
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left: Table */}
            <div className="lg:col-span-2">
              <div className="bg-white p-3 rounded-md border border-gray-300 mb-3">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="text"
                      placeholder="Search order..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">All Payment Method</option>
                    {stats.payment_methods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Approved</option>
                    <option value="failed">Rejected</option>
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-1.5 py-8 text-center text-xs text-gray-500"
                          >
                            Loading payments...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-1.5 py-8 text-center text-xs text-red-600"
                          >
                            {error}
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-1.5 py-8 text-center text-xs text-gray-500"
                          >
                            Tidak ada data payment yang cocok dengan filter.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => {
                          const statusLabel = mapVerificationStatusLabel(
                            order.payment_status,
                          );
                          return (
                            <tr
                              key={order.id}
                              className={`hover:bg-gray-50 cursor-pointer ${
                                selectedOrderId === order.id ? "bg-gray-50" : ""
                              }`}
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              <td className="px-1.5 py-1.5 whitespace-nowrap">
                                <p className="text-xs font-semibold text-blue-600 hover:underline">
                                  {order.order_number}
                                </p>
                                <p className="text-[8px] text-gray-400">
                                  {formatDateTime(order.created_at)}
                                </p>
                              </td>
                              <td className="px-1.5 py-1.5 whitespace-nowrap">
                                <div>
                                  <p className="text-xs font-semibold text-black">
                                    {order.customer_name || "-"}
                                  </p>
                                  <p className="text-[8px] text-gray-400">
                                    {order.customer_email || "-"}
                                  </p>
                                </div>
                              </td>
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs text-black">
                                {order.payment_method || "-"}
                              </td>
                              <td className="px-1.5 py-1.5 whitespace-nowrap">
                                <p className="text-xs font-semibold text-black">
                                  {formatCurrency(order.total)}
                                </p>
                                <p className="text-[8px] text-gray-400">
                                  {order.items?.length || 0} item
                                </p>
                              </td>
                              <td className="px-1.5 py-1.5 whitespace-nowrap">
                                <span
                                  className={`px-1.5 py-0.5 text-[8px] font-semibold rounded-full ${getStatusStyle(
                                    statusLabel,
                                  )}`}
                                >
                                  {statusLabel}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[8px] text-gray-400">
                    Showing {showingFrom} to {showingTo} of {totalItems} payment
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fetchOrders(Math.max(1, currentPage - 1))}
                      disabled={loading || currentPage <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {pageButtons.map((page) => {
                      if (
                        page === "ellipsis-left" ||
                        page === "ellipsis-right"
                      ) {
                        return (
                          <span key={page} className="text-xs text-gray-400">
                            ...
                          </span>
                        );
                      }

                      const pageNumber = Number(page);
                      const isActive = pageNumber === currentPage;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => fetchOrders(pageNumber)}
                          disabled={loading}
                          className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${
                            isActive
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:bg-gray-100 text-gray-600"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() =>
                        fetchOrders(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={loading || currentPage >= totalPages}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Right: Detail Sidebar */}
            {selectedOrder && (
              <div className="lg:col-span-1">
                <div className="bg-white p-3 rounded-md border border-gray-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-black">
                      Payment Details
                    </h3>
                    <span
                      className={`px-1.5 py-0.5 text-[8px] font-semibold rounded-full ${getStatusStyle(
                        mapVerificationStatusLabel(
                          selectedOrder.payment_status,
                        ),
                      )}`}
                    >
                      {mapVerificationStatusLabel(selectedOrder.payment_status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Order ID
                        </p>
                        <p className="text-xs font-semibold text-black">
                          {selectedOrder.order_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Order Date
                        </p>
                        <p className="text-xs text-black">
                          {formatDateTime(selectedOrder.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Customer
                        </p>
                        <p className="text-xs text-black">
                          {selectedOrder.customer_name || "-"}
                        </p>
                        <p className="text-[8px] text-gray-400">
                          {selectedOrder.customer_phone || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Payment Method
                        </p>
                        <p className="text-xs text-black">
                          {selectedOrder.payment_method || "-"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[8px] text-gray-500 mb-0.5">
                        Shipping Address
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedOrder.shipping_address || "-"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Amount
                        </p>
                        <p className="text-xs font-semibold text-black">
                          {formatCurrency(selectedOrder.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-gray-500 mb-0.5">
                          Total Items
                        </p>
                        <p className="text-xs text-black">
                          {selectedOrder.items?.length || 0} item
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proof of Payment */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-black mb-2">
                      Proof of Payment
                    </h4>
                    {selectedOrder.payment_proof ? (
                      <a
                        href={getImageUrl(selectedOrder.payment_proof)}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full h-40 bg-gray-100 rounded-md overflow-hidden"
                      >
                        <img
                          src={getImageUrl(selectedOrder.payment_proof)}
                          alt="Payment proof"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {selectedOrder.payment_status === "pending" && (
                    <button
                      type="button"
                      onClick={handleRejectPayment}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors text-[11px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject Payment
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
