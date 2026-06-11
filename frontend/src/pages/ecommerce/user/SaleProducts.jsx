import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CategoryNav from "../../../components/CategoryNav";
import RecentlyViewed from "../../../components/RecentlyViewed";
import ProductCard from "../../../components/ProductCard";
import styles from "../../../styles/ecommerce/user/SaleProducts.module.css";
import {
  API_URL,
  fetchActiveCategories,
  mapApiProductToCard,
  isOnSale,
} from "../../../utils/productUtils";

function SaleProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saleProducts, setSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const normalizeGenderList = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }

    return [];
  };

  const filteredProducts = useMemo(() => {
    return saleProducts.filter((product) => {
      const productGender = normalizeGenderList(product.gender);
      const matchesGender =
        selectedGender === "all" || productGender.includes(selectedGender);
      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category_id) === String(selectedCategory);

      return matchesGender && matchesCategory;
    });
  }, [saleProducts, selectedGender, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return filteredProducts.map(mapApiProductToCard).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceValue - b.priceValue;
      if (sortBy === "price-desc") return b.priceValue - a.priceValue;
      if (sortBy === "discount-desc")
        return (b.discountPercent || 0) - (a.discountPercent || 0);
      return a.id - b.id;
    });
  }, [filteredProducts, sortBy]);

  const activeCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") return null;

    const matchedCategory = categories.find(
      (category) => String(category.id) === String(selectedCategory),
    );

    return matchedCategory?.name || null;
  }, [categories, selectedCategory]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromQuery = params.get("category");
    setSelectedCategory(categoryFromQuery || "all");
  }, [location.search]);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        setIsLoading(true);
        const [productsResponse, fetchedCategories] = await Promise.all([
          fetch(
            `${API_URL}/products?status=active&limit=10000&_ts=${Date.now()}`,
            {
              cache: "no-store",
            },
          ),
          fetchActiveCategories(),
        ]);
        const result = await productsResponse.json();

        if (result.success && result.data?.products) {
          const onSale = result.data.products.filter(isOnSale);
          setSaleProducts(onSale);
        } else {
          setSaleProducts([]);
        }

        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Gagal memuat produk sale:", error);
        setSaleProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleData();

    const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
    if (storedRecentlyViewed) {
      setRecentProducts(JSON.parse(storedRecentlyViewed));
    }
  }, [refreshTick, location.key]);

  useEffect(() => {
    const triggerRefresh = () => setRefreshTick((prev) => prev + 1);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    window.addEventListener("focus", triggerRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", triggerRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleProductClick = (product) => {
    try {
      const existing = localStorage.getItem("recentlyViewed");
      let list = existing ? JSON.parse(existing) : [];

      list = list.filter((item) => item.id !== product.id);
      list.unshift(product);
      list = list.slice(0, 3);

      localStorage.setItem("recentlyViewed", JSON.stringify(list));
      setRecentProducts(list);

      // Navigasi ke halaman detail dengan state produk
      navigate(`/ecommerce/sale/${product.id}`, { state: { product } });
    } catch (error) {
      console.error("Gagal memperbarui recently viewed:", error);
    }
  };

  const hasActiveFilter =
    selectedGender !== "all" || selectedCategory !== "all";

  return (
    <main className={styles.wrapper}>
      <div className={styles.blackHeaderSpacer}></div>

      <CategoryNav activeCategory="sale" />

      <div className={styles.container}>
        <section
          className={styles.productsSection}
          aria-labelledby="sale-product-title"
        >
          <header className={styles.productsHeader}>
            <h1 id="sale-product-title">
              Sale Products
              {activeCategoryLabel ? ` / ${activeCategoryLabel}` : ""}
              <span className={styles.count}>
                ({isLoading ? "..." : filteredProducts.length})
              </span>
            </h1>

            <div className={styles.controlsRow} aria-label="Product filters">
              <div className={styles.inlineFilterGroup}>
                <div className={styles.filterChips}>
                  {[
                    { label: "All", value: "all" },
                    { label: "Men", value: "men" },
                    { label: "Women", value: "women" },
                    { label: "Kids", value: "kids" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.filterChip} ${selectedGender === option.value ? styles.filterChipActive : ""}`}
                      onClick={() => setSelectedGender(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inlineFilterGroup}>
                <select
                  id="sale-category-filter"
                  className={styles.filterSelect}
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilter && (
                <button
                  type="button"
                  className={styles.clearFiltersBtn}
                  onClick={() => {
                    setSelectedGender("all");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </button>
              )}

              <div className={styles.sortByContainer}>
                <button
                  className={styles.sortBtn}
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  Sort By <span className={styles.arrow}>▼</span>
                </button>
                <button
                  className={styles.sortBtn}
                  type="button"
                  onClick={() => {
                    setIsSortDropdownOpen(false);
                    setRefreshTick((prev) => prev + 1);
                  }}
                >
                  Refresh
                </button>
                {isSortDropdownOpen && (
                  <div className={styles.sortDropdown}>
                    <button
                      className={`${styles.sortOption} ${sortBy === "default" ? styles.sortOptionActive : ""}`}
                      onClick={() => {
                        setSortBy("default");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Default
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "price-asc" ? styles.sortOptionActive : ""}`}
                      onClick={() => {
                        setSortBy("price-asc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "price-desc" ? styles.sortOptionActive : ""}`}
                      onClick={() => {
                        setSortBy("price-desc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Price: High to Low
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "discount-desc" ? styles.sortOptionActive : ""}`}
                      onClick={() => {
                        setSortBy("discount-desc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Biggest Discount
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {isLoading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              Tidak ada produk sale yang cocok dengan filter yang dipilih.
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="sale"
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}
        </section>

        {!isLoading && recentProducts.length > 0 && (
          <>
            <hr className={styles.divider} />
            <RecentlyViewed
              products={recentProducts}
              onProductClick={handleProductClick}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default SaleProducts;
