import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import NavbarEcommerce from "../../../components/NavbarEcommerce";
import CategoryNav from "../../../components/CategoryNav";
import Footer from "../../../components/Footer";
import RecentlyViewed from "../../../components/RecentlyViewed";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const navigate = useNavigate();
  // State untuk item favorit/wishlist
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        return JSON.parse(savedFavorites);
      } catch (error) {
        console.error("Gagal parse favorites dari localStorage", error);
        return [];
      }
    }
    return [];
  });

  // Update localStorage setiap kali favoriteItems berubah
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // Fungsi hapus satu item dari favorit
  const removeItem = (id) => {
    setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Fungsi pindahkan satu item ke keranjang
  const addToBag = (item) => {
    try {
      const savedCart = localStorage.getItem("cart");
      let cart = savedCart ? JSON.parse(savedCart) : [];

      const existingItemIndex = cart.findIndex(
        (c) => c.id === item.id && c.size === item.size
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          category: item.desc,
          size: item.size,
          price: item.priceValue || parseInt(item.price.replace(/[^0-9]/g, "")),
          quantity: 1,
          image: item.image,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${item.name} moved to bag!`);
      // Optional: remove from favorite after adding to bag
      // removeItem(item.id);
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
    }
  };

  // Fungsi pindahkan semua ke keranjang
  const moveAllToBag = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      let cart = savedCart ? JSON.parse(savedCart) : [];

      favoriteItems.forEach((item) => {
        const existingItemIndex = cart.findIndex(
          (c) => c.id === item.id && c.size === item.size
        );

        if (existingItemIndex !== -1) {
          cart[existingItemIndex].quantity += 1;
        } else {
          cart.push({
            id: item.id,
            name: item.name,
            category: item.desc,
            size: item.size,
            price:
              item.priceValue || parseInt(item.price.replace(/[^0-9]/g, "")),
            quantity: 1,
            image: item.image,
          });
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("All items moved to bag!");
      setFavoriteItems([]); // Kosongkan setelah dipindah
    } catch (error) {
      console.error("Gagal memindahkan semua ke keranjang:", error);
    }
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
        
        {/* Header Section: Title & Move All Button */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          {favoriteItems.length > 0 && (
            <button 
              onClick={moveAllToBag}
              className="bg-black hover:bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 flex items-center space-x-2 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {/* 3. FAVORITES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {favoriteItems.map((item) => (
            <div key={item.id} className="flex flex-col group relative">
              
              {/* Product Card Image Container */}
              <div className="bg-[#F3F3F3] p-6 aspect-square flex items-center justify-center relative mb-4">
                {/* Red Heart Badge on top right */}
                <div className="absolute top-4 right-4">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 cursor-pointer" />
                </div>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-contain mix-blend-multiply" 
                />
              </div>

              {/* Product Info */}
              <h3 className="font-bold text-sm tracking-wide">{item.name}</h3>
              <span className="font-semibold text-sm mt-1 mb-3">{item.price}</span>

              {/* 4. ACTION BAR (Size | Add to Bag | Trash) */}
              <div className="flex border border-zinc-300 text-xs font-bold divide-x divide-zinc-300">
                {/* Size Display */}
                <div className="px-3 py-2.5 bg-white text-center min-w-[36px] flex items-center justify-center text-zinc-700">
                  {item.size}
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={() => addToBag(item)}
                  className="flex-1 bg-white hover:bg-zinc-50 text-black uppercase tracking-wider py-2.5 flex items-center justify-center space-x-1.5 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Bag</span>
                </button>

                {/* Trash/Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-2.5 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 transition flex items-center justify-center"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {favoriteItems.length === 0 && (
          <p className="text-center py-16 text-zinc-400 text-sm">
            You haven't added any products to your favorites yet.
          </p>
        )}

        {/* 5. RECENTLY VIEWED SECTION */}
        <div className="mt-28">
          <RecentlyViewed
            products={recentProducts}
            onProductClick={handleProductClick}
          />
        </div>
      </main>

      {/* 6. FOOTER */}
      <Footer isEcommerce={true} />
    </div>
  );
};

export default Favorite;