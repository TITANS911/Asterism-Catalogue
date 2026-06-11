import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import NavbarEcommerce from "../../../components/NavbarEcommerce";
import CategoryNav from "../../../components/CategoryNav";
import Footer from "../../../components/Footer";
import RecentlyViewed from "../../../components/RecentlyViewed";
import { useNavigate } from "react-router-dom";

const Bag = () => {
  const navigate = useNavigate();
  // State untuk data produk di dalam keranjang - Inisialisasi langsung dari localStorage
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

  // Update localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Biaya Tambahan (Bisa disesuaikan)
  const deliveryFee = 15000;
  const discount = 0;

  // Fungsi mengubah kuantitas
  const updateQuantity = (id, amount) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // Fungsi menghapus item dari keranjang
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Fungsi tambah ke wishlist dari bag
  const addToWishlist = (item) => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      // Cek apakah produk sudah ada di favorit
      if (!favorites.some((fav) => fav.id === item.id)) {
        favorites.push({
          id: item.id,
          name: item.name,
          price: formatRupiah(item.price),
          priceValue: item.price,
          image: item.image,
          desc: item.category,
          size: item.size,
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${item.name} added to wishlist!`);
      } else {
        alert(`${item.name} is already in your wishlist!`);
      }
    } catch (error) {
      console.error("Gagal menambahkan ke wishlist:", error);
    }
  };

  // Kalkulasi Total
  const totalProductPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = totalProductPrice + deliveryFee - discount;

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

  // Recently Viewed Logic
  const [recentProducts, setRecentProducts] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setRecentProducts(JSON.parse(stored));
    }
  }, []);

  const handleProductClick = (p) => {
    navigate(`/ecommerce/sale/${p.id}`, { state: { product: p } });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-[96px]">
      {/* 1. TOP NAVBAR */}
      <NavbarEcommerce />

      {/* 2. SUB-NAVBAR */}
      <CategoryNav />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight mb-8">Bag</h1>

        {/* 3. CART TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3] text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200">
                <th className="py-3 px-4 w-[50%]">Product</th>
                <th className="py-3 px-4 text-center">Size</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right pr-12">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {cartItems.map((item) => (
                <tr key={item.id} className="group">
                  {/* Product Info */}
                  <td className="py-6 px-4 flex items-center space-x-4">
                    <input type="checkbox" defaultChecked className="accent-black rounded-none w-4 h-4 cursor-pointer hidden sm:block" />
                    <div className="bg-[#F3F3F3] p-2 w-20 h-20 flex items-center justify-center">
                      <img
                        src={item.image || "https://placehold.co/150x150?text=No+Image"}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x150?text=Error";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide">
                        {item.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.category}
                      </p>
                      <button
                        onClick={() => addToWishlist(item)}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition mt-2 flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3" />
                        Add to Wishlist
                      </button>
                    </div>
                  </td>
                  
                  {/* Size */}
                  <td className="py-6 px-4 text-center font-semibold text-sm">
                    {item.size}
                  </td>
                  
                  {/* Quantity Counter */}
                  <td className="py-6 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  
                  {/* Price & Remove */}
                  <td className="py-6 px-4 text-right relative font-semibold text-sm pr-12">
                    {formatRupiah(item.price * item.quantity)}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cartItems.length === 0 && (
            <p className="text-center py-12 text-zinc-400 text-sm">Your bag is empty.</p>
          )}
        </div>

        {/* 4. SUMMARY BOXES (Two Columns Rounded) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Left Box: Discount & Delivery */}
          <div className="border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-zinc-700">Discount</span>
              <span className="font-bold">{formatRupiah(discount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-zinc-700">Delivery</span>
              <span className="font-bold">{formatRupiah(deliveryFee)}</span>
            </div>
          </div>

          {/* Right Box: Total & Subtotal */}
          <div className="border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-zinc-700">Total</span>
              <span className="font-bold">{formatRupiah(totalProductPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-black">Subtotal</span>
              <span className="font-black text-base">{formatRupiah(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* 5. ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-white hover:bg-zinc-50 text-black border border-black text-xs uppercase font-bold py-4 tracking-widest transition"
          >
            Back To Shop
          </button>
          <button 
            onClick={() => navigate("/ecommerce/checkout")}
            className="w-full bg-black hover:bg-zinc-900 text-white text-xs uppercase font-bold py-4 tracking-widest transition"
          >
            Checkout
          </button>
        </div>

        {/* 6. RECENTLY VIEWED SECTION */}
        <div className="mt-24">
          <RecentlyViewed
            products={recentProducts}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      {/* 7. BLACK FOOTER */}
      <Footer isEcommerce={true} />
    </div>
  );
};

export default Bag;