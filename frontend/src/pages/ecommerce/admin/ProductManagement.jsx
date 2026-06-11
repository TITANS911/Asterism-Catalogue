import SidebarAdmin from "../../../components/sidebarAdmin";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

export default function ProductManagement() {
  // State untuk data dan loading
  const [allProducts, setAllProducts] = useState([]); // Simpan semua produk dari API
  const [products, setProducts] = useState([]); // Produk yang sudah difilter
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Filter by product status
  const [selectedStockStatus, setSelectedStockStatus] = useState(""); // Filter by stock status
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce untuk search term (agar tidak fetch setiap huruf)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Function untuk fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/product-categories`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        // Pastikan yang kita set adalah array
        if (Array.isArray(result.data)) {
          setCategories(result.data);
        } else if (Array.isArray(result.data?.categories)) {
          setCategories(result.data.categories);
        } else {
          setCategories([]);
        }
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  // Function untuk menghitung total stock dari product
  const calculateTotalStock = (product) => {
    const productVariants = Array.isArray(product.variants)
      ? product.variants
      : Array.isArray(product.product_variants)
        ? product.product_variants
        : Array.isArray(product.productVariants)
          ? product.productVariants
          : [];

    return productVariants.length > 0
      ? productVariants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
      : product.stock || 0;
  };

  // Function untuk menentukan stock status
  const getStockStatus = (product) => {
    const totalStock = calculateTotalStock(product);
    if (totalStock === 0) return "out_of_stock";
    if (totalStock < 5) return "low_stock";
    return "in_stock";
  };

  // Function untuk apply semua filter
  const applyFilters = () => {
    let filteredProducts = [...allProducts];

    // Filter by search (jika API tidak support, kita filter client-side)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by category (jika API tidak support, kita filter client-side)
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id === Number(selectedCategory),
      );
    }

    // Filter by product status
    if (selectedStatus) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === selectedStatus,
      );
    }

    // Filter by stock status
    if (selectedStockStatus) {
      filteredProducts = filteredProducts.filter(
        (product) => getStockStatus(product) === selectedStockStatus,
      );
    }

    setProducts(filteredProducts);
  };

  // Function untuk fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch semua produk tanpa pagination untuk card-statistik
      const response = await fetch(`${API_URL}/products?limit=10000`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data produk");
      }

      if (result.success && result.data.products) {
        setAllProducts(result.data.products);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchCategories dan fetchProducts saat komponen mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Jalankan applyFilters setiap kali allProducts atau state filter berubah
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
  }, [
    allProducts,
    debouncedSearchTerm,
    selectedCategory,
    selectedStatus,
    selectedStockStatus,
  ]);

  // Hitung produk yang ditampilkan di halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Fungsi untuk menghapus product
  const handleDelete = async (productId) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      setLoadingDelete(productId);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus produk");
      }

      // Hapus dari allProducts secara langsung agar lebih cepat
      setAllProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Produk berhasil dihapus!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="products" />

      <div className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-black mb-0.5">
              Product Management
            </h1>
            <p className="text-gray-400 text-xs">
              Manage all products in your store.
            </p>
          </div>
          <Link
            to="/ecommerce/admin/products/add"
            className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Product
          </Link>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {allProducts.length}
                </p>
                <p className="text-gray-400 text-[10px]">
                  Total products in store
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
                  Active Products
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {allProducts.filter((p) => p.status === "active").length}
                </p>
                <p className="text-gray-400 text-[10px]">Products displayed</p>
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Inactive Products
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {allProducts.filter((p) => p.status === "inactive").length}
                </p>
                <p className="text-gray-400 text-[10px]">Products in hidden</p>
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Low Stock
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {
                    allProducts.filter((product) => {
                      const status = getStockStatus(product);
                      return (
                        status === "low_stock" || status === "out_of_stock"
                      );
                    }).length
                  }
                </p>
                <p className="text-gray-400 text-[10px]">
                  Low stock & Out of stock
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock (&lt;5)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white rounded-md border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : currentProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => {
                    const productVariants = Array.isArray(product.variants)
                      ? product.variants
                      : Array.isArray(product.product_variants)
                        ? product.product_variants
                        : Array.isArray(product.productVariants)
                          ? product.productVariants
                          : [];

                    const totalStock = calculateTotalStock(product);
                    const stockStatusKey = getStockStatus(product);

                    // Ubah key jadi label yang ramah
                    let stockStatusLabel = "In Stock";
                    let stockStatusColor = "text-green-600";
                    if (stockStatusKey === "out_of_stock") {
                      stockStatusLabel = "Out of Stock";
                      stockStatusColor = "text-red-500";
                    } else if (stockStatusKey === "low_stock") {
                      stockStatusLabel = "Low Stock";
                      stockStatusColor = "text-orange-500";
                    }

                    const productPrice =
                      productVariants.length > 0
                        ? productVariants[0].price
                        : product.price || 0;

                    const productSku =
                      product.sku ||
                      (productVariants.length > 0
                        ? productVariants[0].sku
                        : "-");

                    const productImages = Array.isArray(product.images)
                      ? product.images
                      : [];
                    const imageToShow =
                      product.featured_image || productImages[0];

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                              {imageToShow ? (
                                <img
                                  src={imageToShow}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span>🛹</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-black">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {productSku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-black">
                          {product.category?.name || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {product.discount_price &&
                          product.discount_price < product.price ? (
                            <div>
                              <p className="text-xs font-semibold text-black">
                                Rp
                                {product.discount_price.toLocaleString("id-ID")}
                              </p>
                              <p className="text-[10px] text-gray-400 line-through">
                                Rp{product.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs font-semibold text-black">
                              Rp{product.price.toLocaleString("id-ID")}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div>
                            <p
                              className={`text-xs font-semibold ${stockStatusColor}`}
                            >
                              {totalStock}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {stockStatusLabel}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                              product.status === "active"
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Link
                              to={`/ecommerce/admin/products/edit/${product.id}`}
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
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={loadingDelete === product.id}
                              className="w-7 h-7 flex items-center justify-center border border-red-300 rounded hover:bg-red-50 text-red-600 disabled:opacity-50"
                            >
                              {loadingDelete === product.id ? (
                                <div className="w-3.5 h-3.5 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              )}
                            </button>
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
            Showing {products.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
            products
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
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

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${
                      page === currentPage
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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
          )}
        </div>
      </div>
    </div>
  );
}
