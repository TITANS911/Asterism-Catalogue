import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Landmark,
  QrCode,
  Truck,
  CheckCircle,
  Copy,
  Upload,
} from "lucide-react";
import NavbarEcommerce from "../../../components/NavbarEcommerce";
import CategoryNav from "../../../components/CategoryNav";
import Footer from "../../../components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // State untuk langkah checkout (checkout, complete)
  const [currentStep, setCurrentStep] = useState("checkout");
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for Midtrans redirect query params
  useEffect(() => {
    const transactionStatus = searchParams.get("transaction_status");
    const orderIdParam = searchParams.get("order_id");
    const statusCode = searchParams.get("status_code");

    if (transactionStatus || orderIdParam || statusCode) {
      console.log("Received Midtrans redirect:", {
        transactionStatus,
        orderIdParam,
        statusCode,
      });
      setCurrentStep("complete");
    }
  }, [searchParams]);

  // State untuk data produk di keranjang
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error("Gagal parse cart dari localStorage", error);
        return [];
      }
    }
    return [];
  });

  // State untuk form input
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    postalCode: "",
    notes: "",
  });

  // State untuk pilihan pengiriman
  const [deliveryMethod, setDeliveryMethod] = useState("regular");

  // State untuk data Wilayah Indonesia
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Helper untuk mendapatkan nama wilayah
  const getProvinceName = () =>
    provinces.find((p) => p.id === selectedProvince)?.name || "";
  const getCityName = () =>
    cities.find((c) => c.id === selectedCity)?.name || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch Provinsi
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Fetch Kota berdasarkan Provinsi yang dipilih
  useEffect(() => {
    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`,
      )
        .then((response) => response.json())
        .then((data) => setCities(data))
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
    setSelectedCity("");
  }, [selectedProvince]);

  // Kalkulasi Biaya berdasarkan pilihan kurir
  const shippingFee = deliveryMethod === "regular" ? 15000 : 25000;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + shippingFee;

  const handleCompleteOrder = async () => {
    if (isLoading) return; // Prevent multiple clicks

    try {
      setIsLoading(true);

      // Validasi sederhana
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !selectedCity
      ) {
        alert("Please fill all required fields");
        setIsLoading(false);
        return;
      }

      const orderData = {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${getCityName()}, ${getProvinceName()}`,
        shipping_city: getCityName(),
        shipping_zip: formData.postalCode,
        shipping_cost: shippingFee,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          variant_name: item.size,
        })),
        payment_method: "midtrans",
        notes: formData.notes,
      };

      // 1. Simpan order ke database
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      const createdOrder = result.data;
      setOrderId(createdOrder.id);

      // 2. Dapatkan Snap token dari backend
      const midtransResponse = await fetch(
        "http://localhost:3001/api/midtrans/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            orderId: createdOrder.id,
          }),
        },
      );

      const midtransResult = await midtransResponse.json();

      if (!midtransResult.success) {
        throw new Error(midtransResult.message);
      }

      // 3. Redirect to Midtrans payment page
      console.log("--- Frontend Debug ---");
      console.log("Midtrans Result:", midtransResult);
      const snapToken = midtransResult.data.token;
      const redirectUrl = midtransResult.data.redirect_url;
      console.log("Snap Token:", snapToken);
      console.log("Redirect URL:", redirectUrl);

      localStorage.removeItem("cart");
      setIsLoading(false);

      // Redirect to Midtrans payment page (most reliable method!)
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to create order: " + error.message);
      setIsLoading(false);
    }
  };

  // Format ke Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp");
  };

  // Render Langkah-Langkah (Progress Bar)
  const renderProgressSteps = () => (
    <div className="flex justify-center items-center max-w-3xl mx-auto mb-16 text-xs md:text-sm tracking-widest font-bold uppercase">
      <div
        className={`flex flex-col items-center ${currentStep === "checkout" ? "text-black" : "text-zinc-400"}`}
      >
        <span>01</span>
        <span className="mt-1">Checkout</span>
      </div>
      <div className="flex-1 h-[1px] bg-zinc-300 mx-6 md:mx-12"></div>
      <div
        className={`flex flex-col items-center ${currentStep === "payment" ? "text-black" : "text-zinc-400"}`}
      >
        <span>02</span>
        <span className="mt-1">Payment</span>
      </div>
      <div className="flex-1 h-[1px] bg-zinc-300 mx-6 md:mx-12"></div>
      <div
        className={`flex flex-col items-center ${currentStep === "complete" ? "text-black" : "text-zinc-400"}`}
      >
        <span>03</span>
        <span className="mt-1">Complete</span>
      </div>
    </div>
  );

  // VIEW 1: CHECKOUT FORM
  if (currentStep === "checkout") {
    return (
      <div className="min-h-screen bg-white text-black font-sans pt-[96px]">
        <NavbarEcommerce />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
          {renderProgressSteps()}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-10">
              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-zinc-800">
                  <Mail className="w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-600">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx"
                      className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-600">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order..."
                      className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full min-h-[100px]"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-zinc-800">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    Shipping Address
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-600">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address..."
                      className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-600">
                        Province
                      </label>
                      <select
                        className="border border-zinc-300 px-3 py-2 text-xs bg-white focus:outline-none focus:border-black rounded-none w-full text-zinc-700"
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                      >
                        <option value="">Select province</option>
                        {provinces.map((prov) => (
                          <option key={prov.id} value={prov.id}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-600">
                        City
                      </label>
                      <select
                        className="border border-zinc-300 px-3 py-2 text-xs bg-white focus:outline-none focus:border-black rounded-none w-full text-zinc-700"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedProvince}
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-600">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal code"
                        className="border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none w-full"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-zinc-800">
                  <Truck className="w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    Delivery Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label
                    className={`flex justify-between items-center p-4 border cursor-pointer transition ${deliveryMethod === "regular" ? "border-black bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "regular"}
                        onChange={() => setDeliveryMethod("regular")}
                        className="accent-black w-4 h-4"
                      />
                      <div className="text-xs">
                        <p className="font-bold">Regular Delivery</p>
                        <p className="text-zinc-400 mt-0.5">
                          3-4 business days
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold">
                      {formatRupiah(15000)}
                    </span>
                  </label>
                  <label
                    className={`flex justify-between items-center p-4 border cursor-pointer transition ${deliveryMethod === "express" ? "border-black bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="accent-black w-4 h-4"
                      />
                      <div className="text-xs">
                        <p className="font-bold">Express Delivery</p>
                        <p className="text-zinc-400 mt-0.5">
                          1-2 business days
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold">
                      {formatRupiah(25000)}
                    </span>
                  </label>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 text-zinc-800">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    Payment Method
                  </h2>
                </div>
                <div className="p-4 border border-zinc-300 bg-zinc-50">
                  <p className="text-xs font-bold">
                    Midtrans (All Payment Methods)
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    QRIS, Bank Transfer, Virtual Account, Credit Card, etc.
                  </p>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-zinc-200 p-6 shadow-sm sticky top-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-800 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-6 pb-6 border-b border-zinc-100">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-[#F3F3F3] p-2 w-16 h-16 flex items-center justify-center shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="text-xs">
                          <h3 className="font-bold tracking-wide">
                            {item.name}
                          </h3>
                          <p className="text-zinc-400 mt-0.5">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="py-4 space-y-3 border-b border-zinc-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-500">
                      Subtotal
                    </span>
                    <span className="font-bold">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-500">
                      Shipping
                    </span>
                    <span className="font-bold">
                      {formatRupiah(shippingFee)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-5 text-xs">
                  <span className="font-bold text-black uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-black text-sm">
                    {formatRupiah(total)}
                  </span>
                </div>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-zinc-900 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-xs uppercase font-bold py-4 tracking-widest transition mt-2"
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer isEcommerce={true} />
      </div>
    );
  }

  // VIEW 2: COMPLETE PAGE
  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-white text-black font-sans pt-[96px]">
        <NavbarEcommerce />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
          {renderProgressSteps()}

          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="flex flex-col items-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                You're All Set!
              </h2>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                Thank you for your order! We will process your order once
                payment is confirmed.
              </p>
              <button
                onClick={() => navigate("/ecommerce/orders")}
                className="mt-8 bg-black hover:bg-zinc-900 text-white text-xs uppercase font-bold px-12 py-4 tracking-widest transition"
              >
                View My Orders
              </button>
            </div>
          </div>
        </main>
        <Footer isEcommerce={true} />
      </div>
    );
  }

  return null;
};

export default Checkout;
