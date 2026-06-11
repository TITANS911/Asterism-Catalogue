import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  MapPin,
  PackageSearch,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import NavbarEcommerce from "../../../components/NavbarEcommerce";
import CategoryNav from "../../../components/CategoryNav";
import Footer from "../../../components/Footer";

const API_BASE_URL = "http://localhost:3001";

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number || 0));

const formatDate = (value) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const normalizeMidtransOrderNumber = (value) => {
  if (!value) return "";
  const parts = value.split("-");
  return parts.length > 2 ? parts.slice(0, -1).join("-") : value;
};

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  return path;
};

const getPaymentLabel = (paymentMethod) => {
  if (!paymentMethod) return "-";
  if (paymentMethod === "midtrans") return "Midtrans";
  if (paymentMethod === "qris") return "QRIS";
  if (paymentMethod === "gopay") return "GoPay";
  if (paymentMethod === "shopeepay") return "ShopeePay";
  if (paymentMethod === "echannel") return "Mandiri Bill Payment";
  return paymentMethod
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDeliveryLabel = (shippingCost) => {
  const parsed = Number(shippingCost || 0);
  if (parsed >= 25000) return "Express Delivery";
  if (parsed > 0) return "Regular Delivery";
  return "Standard Delivery";
};

const getStatusMeta = (order) => {
  if (order.payment_status === "paid") {
    return {
      title: "Pembayaran berhasil",
      description: "Pembayaran sudah kami terima dan pesanan sedang diproses.",
      badgeClass: "bg-emerald-50 text-emerald-700",
      dotClass: "bg-emerald-500",
      label: "Paid",
    };
  }

  if (order.payment_status === "failed") {
    return {
      title: "Pembayaran gagal",
      description:
        "Pembayaran belum berhasil. Silakan cek detail transaksi Anda.",
      badgeClass: "bg-red-50 text-red-700",
      dotClass: "bg-red-500",
      label: "Failed",
    };
  }

  if (order.order_status === "processing") {
    return {
      title: "Pesanan diproses",
      description: "Pesanan sedang disiapkan oleh tim Asterism.",
      badgeClass: "bg-zinc-100 text-zinc-700",
      dotClass: "bg-zinc-500",
      label: "Processing",
    };
  }

  return {
    title: "Menunggu pembayaran",
    description:
      "Pesanan sudah dibuat dan sedang menunggu konfirmasi pembayaran.",
    badgeClass: "bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
    label: "Pending",
  };
};

export default function Orders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Gagal mengambil data pesanan.");
        }

        const fetchedOrders = result.data || [];
        setOrders(fetchedOrders);

        const redirectedOrderNumber = normalizeMidtransOrderNumber(
          searchParams.get("order_id"),
        );

        const selectedOrder =
          fetchedOrders.find(
            (order) => order.order_number === redirectedOrderNumber,
          ) || fetchedOrders[0];

        setActiveOrderId(selectedOrder?.id || null);
      } catch (fetchError) {
        console.error("Orders Error:", fetchError);
        setError(fetchError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams]);

  const activeOrder = useMemo(
    () => orders.find((order) => order.id === activeOrderId) || null,
    [orders, activeOrderId],
  );

  const paymentStatusFromRedirect = searchParams.get("transaction_status");

  const handlePayWithMidtrans = async () => {
    if (!activeOrder || payLoading) return;
    if (activeOrder.payment_status !== "pending") return;

    try {
      setPayLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/midtrans/create-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ orderId: activeOrder.id }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal memulai pembayaran Midtrans.");
      }

      const redirectUrl = result.data?.redirect_url;
      if (!redirectUrl) {
        throw new Error("Redirect URL Midtrans tidak ditemukan.");
      }

      window.location.href = redirectUrl;
    } catch (err) {
      alert(err.message);
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#111111] pt-[96px]">
      <NavbarEcommerce />
      <CategoryNav />

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Lihat status pembayaran dan detail pesanan terbaru Anda.
            </p>
          </div>
        </div>

        {paymentStatusFromRedirect && (
          <div className="mb-8 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
            Status transaksi Midtrans:{" "}
            <span className="font-semibold uppercase">
              {paymentStatusFromRedirect}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="border border-zinc-200 p-10 flex items-center justify-center gap-3 text-zinc-500">
            <LoaderCircle className="w-5 h-5 animate-spin" />
            <span>Memuat data pesanan...</span>
          </div>
        ) : error ? (
          <div className="border border-red-200 bg-red-50 p-6 flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">Gagal memuat pesanan</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-zinc-200 p-10 text-center text-zinc-500">
            <PackageSearch className="w-10 h-10 mx-auto mb-4" />
            <p className="font-semibold text-zinc-700">Belum ada pesanan</p>
            <p className="text-sm mt-1">
              Pesanan yang sudah dibuat akan muncul di halaman ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              {orders.map((order) => {
                const firstItem = order.items?.[0];
                const statusMeta = getStatusMeta(order);
                const imageUrl = getImageUrl(
                  firstItem?.product?.featured_image,
                );

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setActiveOrderId(order.id)}
                    className={`w-full border rounded-xl p-4 flex items-center justify-between text-left transition-all ${
                      activeOrderId === order.id
                        ? "border-black shadow-sm"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={firstItem?.product_name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <PackageSearch className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 uppercase font-medium">
                          Order ID
                        </p>
                        <p className="text-xs font-bold tracking-wide truncate">
                          {order.order_number}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                          <span>{formatDate(order.created_at)}</span>
                          <span>|</span>
                          <span>{order.items?.length || 0} Item</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs font-bold mb-2">
                        {formatRupiah(order.total)}
                      </p>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${statusMeta.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`}
                        ></span>
                        {statusMeta.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 ml-2 shrink-0"
                    />
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 border border-gray-200 rounded-xl p-6 bg-white">
              {activeOrder && (
                <>
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-5 mb-5">
                    <CheckCircle2 className="text-zinc-700 mt-0.5" size={22} />
                    <div>
                      <h3 className="text-sm font-bold text-[#111111]">
                        {getStatusMeta(activeOrder).title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {getStatusMeta(activeOrder).description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs border-b border-gray-100 pb-5 mb-5">
                    <div>
                      <p className="text-gray-400 mb-0.5">Order ID</p>
                      <p className="font-bold">{activeOrder.order_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Payment Method</p>
                      <p className="font-bold">
                        {getPaymentLabel(activeOrder.payment_method)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Order Date</p>
                      <p className="font-bold">
                        {formatDate(activeOrder.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Payment Status</p>
                      <p className="font-bold text-black uppercase">
                        {activeOrder.payment_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Shipping Address</p>
                      <p className="font-medium leading-relaxed">
                        {activeOrder.shipping_address}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Delivery Method</p>
                      <p className="font-bold">
                        {getDeliveryLabel(activeOrder.shipping_cost)}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Ongkir {formatRupiah(activeOrder.shipping_cost)}
                      </p>
                    </div>
                  </div>

                  {activeOrder.payment_status === "pending" && (
                    <div className="mb-5 border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs flex items-center justify-between gap-3">
                      <div className="text-zinc-700">
                        Pembayaran belum selesai. Klik untuk lanjut bayar via
                        Midtrans.
                      </div>
                      <button
                        type="button"
                        onClick={handlePayWithMidtrans}
                        disabled={payLoading}
                        className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {payLoading ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  )}

                  <div className="space-y-4 border-b border-gray-100 pb-5 mb-5">
                    {activeOrder.items?.map((item) => {
                      const itemImageUrl = getImageUrl(
                        item.product?.featured_image,
                      );

                      return (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {itemImageUrl ? (
                              <img
                                src={itemImageUrl}
                                alt={item.product_name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <PackageSearch className="w-6 h-6 text-zinc-400" />
                            )}
                          </div>
                          <div className="flex-1 flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold">
                                {item.product_name}
                              </h4>
                              <p className="text-gray-400 text-[11px] mt-1">
                                Size: {item.variant_name || "-"}{" "}
                                <span className="mx-1">|</span> Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <p className="text-xs font-bold">
                              {formatRupiah(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-xs border-b border-gray-100 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold">
                        {formatRupiah(activeOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold">
                        {formatRupiah(activeOrder.shipping_cost)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-bold text-sm">
                    <span>Total</span>
                    <span className="text-base">
                      {formatRupiah(activeOrder.total)}
                    </span>
                  </div>

                  <div className="mt-6 text-xs text-zinc-500 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      Kota tujuan: {activeOrder.shipping_city || "-"}, kode pos{" "}
                      {activeOrder.shipping_zip || "-"}.
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer isEcommerce={true} />
    </div>
  );
}
