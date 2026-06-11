import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
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
import { API_URL, mapApiProductToCard } from "../../../utils/productUtils";

const DetailSaleProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Cek apakah produk ini sudah ada di favorit saat mount atau saat produk berubah
  useEffect(() => {
    if (product) {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.some((item) => item.id === product.id));
      }
    }
  }, [product]);

  // Ambil varian ukuran dari data produk secara lebih fleksibel
  const sizeVariants = product?.variants && product.variants.length > 0
    ? [
        ...new Set(
          product.variants.map((v) => v.variant_value)
        ),
      ]
    : [];

  // Ambil nama varian untuk label (misal: "Size", "Ukuran", atau "90")
  const variantLabel = product?.variants && product.variants.length > 0
    ? product.variants[0].variant_name
    : "Size";

  // Jika tidak ada varian, gunakan default untuk produk fashion, atau kosongkan untuk produk lain
  const sizes =
    sizeVariants.length > 0
      ? sizeVariants
      : product?.category_id === 1 // Asumsi category_id 1 adalah fashion/jersey
        ? ["XS", "S", "M", "L", "XL", "XXL"]
        : [];

  // Jika tidak ada data di state, kita bisa fetch (opsional, tapi bagus untuk UX)
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const result = await response.json();
        if (result.success && result.data) {
          const mapped = mapApiProductToCard(result.data);
          setProduct(mapped);
        }
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      }
    };

    if (!product && id) {
      fetchProductDetail();
    }
  }, [id, product]);

  // Set default size saat product atau sizes berubah
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setRecentProducts(JSON.parse(stored));
    }
  }, []);

  // Ambil data stok untuk varian yang dipilih
  const selectedVariantData = product?.variants?.find(
    (v) => v.variant_value === selectedSize
  );
  const currentStock = selectedVariantData ? selectedVariantData.stock : (product?.stock || 0);

  const handleProductClick = (p) => {
    try {
      const existing = localStorage.getItem("recentlyViewed");
      let list = existing ? JSON.parse(existing) : [];

      list = list.filter((item) => item.id !== p.id);
      list.unshift(p);
      list = list.slice(0, 3);

      localStorage.setItem("recentlyViewed", JSON.stringify(list));
      setRecentProducts(list);

      if (p.id !== product.id) {
        navigate(`/ecommerce/sale/${p.id}`, { state: { product: p } });
        setProduct(p);
      }
    } catch (error) {
      console.error("Gagal memperbarui recently viewed:", error);
    }
  };

  const handleAddToCart = () => {
    try {
      const existingCart = localStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];

      // Cari apakah produk dengan ID dan Size yang sama sudah ada
      const existingItemIndex = cart.findIndex(
        (item) => item.id === product.id && item.size === selectedSize,
      );

      if (existingItemIndex !== -1) {
        // Jika ada, update quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Jika belum ada, tambahkan item baru
        cart.push({
          id: product.id,
          name: product.name,
          category: product.desc,
          size: selectedSize,
          price: product.priceValue || parseInt(product.price.replace(/[^0-9]/g, "")),
          quantity: quantity,
          image: product.image,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      navigate("/ecommerce/bag");
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Gagal menambahkan ke keranjang");
    }
  };

  const toggleWishlist = () => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (isFavorite) {
        // Hapus dari favorit
        favorites = favorites.filter((item) => item.id !== product.id);
        setIsFavorite(false);
      } else {
        // Tambah ke favorit
        favorites.push({
          id: product.id,
          name: product.name,
          price: product.price,
          priceValue: product.priceValue,
          image: product.image,
          desc: product.desc,
          size: selectedSize || "All Size",
        });
        setIsFavorite(true);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Gagal memperbarui wishlist:", error);
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-600 selection:text-white pt-[96px]">
      {/* 1. TOP NAVBAR */}
      <NavbarEcommerce />

      {/* 2. SUB-NAVBAR */}
      <CategoryNav activeCategory="sale" />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        {/* 3. PRODUCT DETAIL SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT: Product Gallery */}
          <div className="bg-[#F3F3F3] p-8 relative group aspect-square flex items-center justify-center">
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition z-10"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorite ? "text-red-500 fill-red-500" : "text-zinc-600"}`}
              />
            </button>
            <img
              src={product.image || "https://placehold.co/500x500?text=No+Image"}
              alt={product.name}
              className="w-full h-auto object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.src = "https://placehold.co/500x500?text=Image+Error";
              }}
            />
          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">{product.desc}</p>
              <div className="flex items-center gap-3 mt-4">
                <p className="text-xl font-bold tracking-wide">{product.price}</p>
                {product.originalPrice && (
                  <p className="text-zinc-400 line-through text-sm">
                    {product.originalPrice}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-zinc-200" />

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <span className="text-xs uppercase font-bold tracking-wider block mb-3 text-zinc-700">
                  Select {variantLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={`${size}-${index}`}
                      onClick={() => setSelectedSize(size)}
                      className={`border text-xs font-semibold px-4 py-2.5 transition-all min-w-[48px] ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 text-zinc-800 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-700">
                  Quantity
                </span>
                <span className={`text-xs font-semibold ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStock > 0 ? `Stock: ${currentStock}` : 'Out of Stock'}
                </span>
              </div>
              <div className="inline-flex border border-zinc-300 items-center">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="px-3 py-2 hover:bg-zinc-100 transition text-zinc-600"
                  disabled={currentStock === 0}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
                  {currentStock > 0 ? quantity : 0}
                </span>
                <button
                  onClick={() => setQuantity((q) => (q < currentStock ? q + 1 : q))}
                  className="px-3 py-2 hover:bg-zinc-100 transition text-zinc-600"
                  disabled={currentStock === 0 || quantity >= currentStock}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className="w-full bg-black hover:bg-zinc-900 text-white text-xs uppercase font-bold py-4 tracking-widest transition flex items-center justify-center space-x-2 disabled:bg-zinc-400 disabled:cursor-not-allowed"
              >
                <span>{currentStock > 0 ? "Add To Cart" : "Sold Out"}</span>
                <ShoppingBag className="w-4 h-4" />
              </button>
              <button
                onClick={toggleWishlist}
                className="w-full bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-xs uppercase font-bold py-4 tracking-widest transition flex items-center justify-center space-x-2"
              >
                <span>{isFavorite ? "In Wishlist" : "Add To Wishlist"}</span>
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : ""}`}
                />
              </button>
            </div>

            {/* 4. ACCORDIONS */}
            <div className="border-t border-zinc-200 mt-6">
              {[
                {
                  id: "desc",
                  title: "Description",
                  content:
                    product.fullDesc ||
                    product.desc ||
                    "Premium athletic product from Asterism.",
                },
                {
                  id: "size",
                  title: "Size Chart",
                  content:
                    "XS: 46x66 cm | S: 48x68 cm | M: 50x70 cm | L: 52x72 cm | XL: 54x74 cm | XXL: 56x76 cm.",
                },
                {
                  id: "shipping",
                  title: "Free Delivery & Returns",
                  content:
                    "Free standard shipping on all orders over Rp500.000. Returns accepted within 7 days of delivery.",
                },
              ].map((item) => (
                <div key={item.id} className="border-b border-zinc-200">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex justify-between items-center py-4 text-sm font-semibold tracking-wide text-left focus:outline-none"
                  >
                    <span>{item.title}</span>
                    <span className="text-lg font-light">
                      {activeAccordion === item.id ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${activeAccordion === item.id ? "max-h-40 pb-4" : "max-h-0"}`}
                  >
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. RECENTLY VIEWED SECTION */}
        <div className="mt-24">
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

export default DetailSaleProduct;