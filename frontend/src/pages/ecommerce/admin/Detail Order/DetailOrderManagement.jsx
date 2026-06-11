import SidebarAdmin from "../../../../components/sidebarAdmin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3001/api";

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

const mapOrderStatusLabel = (status) => {
  if (status === "pending") return "Pending Payment";
  if (status === "processing") return "Processing";
  if (status === "shipped") return "Shipped";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return String(status || "-");
};

const mapPaymentStatusLabel = (status) => {
  if (status === "paid") return "Approved";
  if (status === "pending") return "Disapproved";
  if (status === "failed") return "Disapproved";
  if (status === "refunded") return "Refunded";
  return String(status || "-");
};

export default function DetailOrderManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

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
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Disapproved":
        return "bg-red-50 text-red-600 border border-red-200";
      case "Refunded":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending Payment":
        return (
          <svg
            className="w-3 h-3 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Processing":
        return (
          <svg
            className="w-3 h-3 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Shipped":
        return (
          <svg
            className="w-3 h-3 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Completed":
        return (
          <svg
            className="w-3 h-3 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Cancelled":
        return (
          <svg
            className="w-3 h-3 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-3 h-3 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L9 9.586V7z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil detail order");
      }

      if (result.success) {
        setOrder(result.data);
      }
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (nextStatus) => {
    const confirmMessage =
      nextStatus === "cancelled"
        ? "Apakah kamu yakin ingin membatalkan order ini?"
        : `Ubah status order menjadi ${mapOrderStatusLabel(nextStatus)}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(nextStatus);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_status: nextStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status order");
      }

      if (result.success) {
        setOrder(result.data);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const handleCopyAddress = async () => {
    if (!order) return;

    const addressText = [
      order.customer_name,
      order.shipping_address,
      [order.shipping_city, order.shipping_zip].filter(Boolean).join(" "),
      order.customer_phone,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(addressText);
      alert("Alamat berhasil disalin");
    } catch (err) {
      alert("Gagal menyalin alamat");
    }
  };

  const orderStatusLabel = mapOrderStatusLabel(order?.order_status);
  const paymentStatusLabel = mapPaymentStatusLabel(order?.payment_status);
  const items = Array.isArray(order?.items) ? order.items : [];

  const timelineSteps = useMemo(() => {
    const histories = Array.isArray(order?.status_histories)
      ? [...order.status_histories].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        )
      : [];

    const findFirstHistoryTime = (fieldName, toValue) => {
      const match = histories.find(
        (entry) =>
          entry?.field_name === fieldName && entry?.to_value === toValue,
      );
      return match?.created_at ? formatDateTime(match.created_at) : null;
    };

    const isPaymentApproved = order?.payment_status === "paid";
    const isProcessing = ["processing", "shipped", "completed"].includes(
      order?.order_status,
    );
    const isShipped = ["shipped", "completed"].includes(order?.order_status);
    const isCompleted = order?.order_status === "completed";
    const isCancelled = order?.order_status === "cancelled";

    const paymentConfirmedTime =
      findFirstHistoryTime("payment_status", "paid") ||
      (isPaymentApproved ? formatDateTime(order?.updated_at) : null);

    const processingTime =
      findFirstHistoryTime("order_status", "processing") ||
      (isProcessing ? formatDateTime(order?.updated_at) : null);

    const shippedTime =
      findFirstHistoryTime("order_status", "shipped") ||
      (isShipped ? formatDateTime(order?.updated_at) : null);

    const completedTime =
      findFirstHistoryTime("order_status", "completed") ||
      (isCompleted ? formatDateTime(order?.updated_at) : null);

    const cancelledTime =
      findFirstHistoryTime("order_status", "cancelled") ||
      (isCancelled ? formatDateTime(order?.updated_at) : null);

    return [
      {
        label: "Order Placed",
        active: Boolean(order),
        time: formatDateTime(order?.created_at),
        color: "bg-black",
      },
      {
        label: "Payment Confirmed",
        active: isPaymentApproved,
        time: isPaymentApproved ? paymentConfirmedTime || "-" : "-",
        color: "bg-green-600",
      },
      {
        label: "Order Processing",
        active: isProcessing,
        time: isProcessing ? processingTime || "-" : "-",
        color: "bg-blue-600",
      },
      {
        label: "Order Shipped",
        active: isShipped,
        time: isShipped ? shippedTime || "-" : "-",
        color: "bg-purple-600",
      },
      {
        label: isCancelled ? "Order Cancelled" : "Order Completed",
        active: isCancelled || isCompleted,
        time: isCancelled
          ? cancelledTime || "-"
          : isCompleted
            ? completedTime || "-"
            : "-",
        color: isCancelled ? "bg-red-600" : "bg-green-600",
      },
    ];
  }, [order]);

  const actionButtons = [
    {
      key: "processing",
      label: "Mark as Processing",
      className: "border-blue-500 text-blue-600 hover:bg-blue-50",
    },
    {
      key: "shipped",
      label: "Mark as Shipped",
      className: "border-purple-500 text-purple-600 hover:bg-purple-50",
    },
    {
      key: "completed",
      label: "Mark as Completed",
      className: "border-green-500 text-green-600 hover:bg-green-50",
    },
    {
      key: "cancelled",
      label: "Cancel Order",
      className: "border-red-500 text-red-600 hover:bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <SidebarAdmin activePage="orders" />
        <div className="ml-64 p-4 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <SidebarAdmin activePage="orders" />
        <div className="ml-64 p-4">
          <div className="bg-white border border-gray-300 rounded-md p-6 text-center">
            <p className="text-sm text-red-600 mb-3">
              {error || "Order tidak ditemukan."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/ecommerce/admin/orders")}
              className="px-3 py-1.5 bg-black text-white rounded-md text-xs font-semibold"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="orders" />
      <div className="ml-64 p-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-lg font-bold text-black mb-0.5">
              Order Details
            </h1>
            <p className="text-gray-400 text-[11px]">
              View complete information about this order
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/ecommerce/admin/orders"
              className="flex items-center gap-1.5 bg-white border border-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-50 transition-colors text-[11px] font-semibold"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800 transition-colors text-[11px] font-semibold"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Print Invoice
            </button>
          </div>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                  Order ID
                </p>
                <p className="text-[11px] font-semibold text-black">
                  {order.order_number}
                </p>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[8px] font-semibold rounded-full flex items-center gap-1 ${getStatusStyle(orderStatusLabel)}`}
              >
                {getStatusIcon(orderStatusLabel)}
                {orderStatusLabel}
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div>
              <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                Order Date
              </p>
              <p className="text-[11px] font-semibold text-black">
                {formatDateTime(order.created_at)}
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div>
              <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                Payment Method
              </p>
              <p className="text-[11px] font-semibold text-black">
                {order.payment_method || "-"}
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-[11px] font-medium mb-0.5">
                  Payment Status
                </p>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[8px] font-semibold rounded-full flex items-center gap-1 ${getPaymentStatusStyle(
                  paymentStatusLabel,
                )}`}
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {paymentStatusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-3">
          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </h3>
            <div className="space-y-1.5">
              <div>
                <p className="text-[8px] text-gray-500 mb-0.5">Name</p>
                <p className="text-[11px] text-black">
                  {order.customer_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-gray-500 mb-0.5">Email</p>
                <p className="text-[11px] text-black">
                  {order.customer_email || "-"}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-gray-500 mb-0.5">Phone</p>
                <p className="text-[11px] text-black">
                  {order.customer_phone || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Shipping Address
            </h3>
            <div className="space-y-0.5">
              <p className="text-[11px] text-black">
                {order.customer_name || "-"}
              </p>
              <p className="text-[11px] text-gray-600">
                {order.shipping_address || "-"}
              </p>
              <p className="text-[11px] text-gray-600">
                {[order.shipping_city, order.shipping_zip]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              <p className="text-[11px] text-gray-600">
                {order.customer_phone || "-"}
              </p>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="mt-1.5 text-[8px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Address
              </button>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Order Status Timeline
            </h3>
            <div className="space-y-2">
              {timelineSteps.map((step, index) => {
                const isLast = index === timelineSteps.length - 1;
                return (
                  <div key={step.label} className="flex items-start gap-1.5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          step.active ? step.color : "bg-gray-300"
                        }`}
                      >
                        {step.active && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      {!isLast && (
                        <div className="w-px h-5 bg-gray-300 mt-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-[8px] font-semibold ${
                          step.active ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-[7px] ${
                          step.active ? "text-gray-400" : "text-gray-300"
                        }`}
                      >
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ordered Items & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-3">
          <div className="lg:col-span-2">
            <div className="bg-white p-3 rounded-md border border-gray-300">
              <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Ordered Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-1.5 py-1.5 text-left text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="px-1.5 py-1.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <svg
                                  className="w-4 h-4 text-gray-400"
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
                              )}
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-black">
                                {item.product_name}
                              </p>
                              <p className="text-[8px] text-gray-400">
                                {item.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-[11px] text-gray-600">
                          {item.variant_name || "-"}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-[11px] text-black">
                          {item.quantity}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-[11px] text-black">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-1.5 py-1.5 whitespace-nowrap text-[11px] font-semibold text-black">
                          {formatCurrency(
                            Number(item.price) * Number(item.quantity),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-300">
            <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Order Summary
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-gray-500">
                  Subtotal (
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </p>
                <p className="text-[11px] font-semibold text-black">
                  {formatCurrency(order.subtotal)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-gray-500">Shipping Fee</p>
                <p className="text-[11px] font-semibold text-black">
                  {formatCurrency(order.shipping_cost)}
                </p>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-[11px] text-gray-500">Discount</p>
                  <p className="text-[11px] font-semibold text-red-600">
                    - {formatCurrency(order.discount)}
                  </p>
                </div>
              )}
              <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
                <p className="text-[11px] font-semibold text-gray-700">Total</p>
                <p className="text-sm font-bold text-black">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white p-3 rounded-md border border-gray-300">
          <h3 className="text-sm font-semibold text-black mb-2.5 flex items-center gap-1.5">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {actionButtons.map((action) => (
              <button
                key={action.key}
                type="button"
                disabled={
                  actionLoading === action.key ||
                  order.order_status === action.key
                }
                onClick={() => handleUpdateStatus(action.key)}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 bg-white border rounded-md transition-colors text-[11px] font-semibold disabled:opacity-50 ${action.className}`}
              >
                {actionLoading === action.key ? "Updating..." : action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
