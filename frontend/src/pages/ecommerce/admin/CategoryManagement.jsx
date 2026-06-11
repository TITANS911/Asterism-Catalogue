import SidebarAdmin from "../../../components/sidebarAdmin";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

export default function CategoryManagement() {
  const [productCategories, setProductCategories] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [currentVariantPage, setCurrentVariantPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch product categories
      const categoryResponse = await fetch(`${API_URL}/product-categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const categoryData = await categoryResponse.json();
      if (categoryData.success && categoryData.data) {
        setProductCategories(categoryData.data.categories || categoryData.data || []);
      }

      // Fetch product variants
      const variantResponse = await fetch(`${API_URL}/product-variants`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const variantData = await variantResponse.json();
      if (variantData.success && variantData.data) {
        setVariantCategories(variantData.data.variants || variantData.data || []);
      }

      // Fetch products
      const productsResponse = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const productsData = await productsResponse.json();
      if (
        productsData.success &&
        productsData.data &&
        productsData.data.products
      ) {
        setProducts(productsData.data.products);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mendapatkan style status
  const getStatusStyle = (status) => {
    return status === "active"
      ? "bg-green-50 text-green-600 border border-green-200"
      : "bg-gray-50 text-gray-600 border border-gray-200";
  };

  // Fungsi untuk menghitung total produk per kategori
  const getProductsCountByCategory = (categoryId) => {
    return products.filter((product) => product.category_id === categoryId)
      .length;
  };

  // Hitung total kategori aktif dan inactive
  const activeCategoriesCount = productCategories.filter(
    (cat) => cat.status === "active",
  ).length;
  const inactiveCategoriesCount = productCategories.filter(
    (cat) => cat.status === "inactive",
  ).length;

  // Filter categories berdasarkan status
  const filteredCategories = productCategories.filter((cat) => {
    if (statusFilter === "") return true;
    return cat.status === statusFilter;
  });

  // Pagination untuk Product Categories
  const indexOfLastCategory = currentCategoryPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory,
  );
  const totalCategoryPages = Math.ceil(
    filteredCategories.length / itemsPerPage,
  );

  // Reset halaman ketika filter berubah
  useEffect(() => {
    setCurrentCategoryPage(1);
  }, [statusFilter]);

  // Pagination untuk Product Variants
  const indexOfLastVariant = currentVariantPage * itemsPerPage;
  const indexOfFirstVariant = indexOfLastVariant - itemsPerPage;
  const currentVariants = variantCategories.slice(
    indexOfFirstVariant,
    indexOfLastVariant,
  );
  const totalVariantPages = Math.ceil(variantCategories.length / itemsPerPage);

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const isConfirmed = window.confirm(
      `Yakin ingin menghapus category product "${categoryName}"?`,
    );

    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/product-categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus category product");
      }

      setProductCategories((prev) => prev.filter((item) => item.id !== categoryId));
      alert("Category product berhasil dihapus");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVariant = async (variantId, variantLabel) => {
    const isConfirmed = window.confirm(
      `Yakin ingin menghapus category variant "${variantLabel}"?`,
    );

    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/product-variants/${variantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus category variant");
      }

      setVariantCategories((prev) => prev.filter((item) => item.id !== variantId));
      alert("Category variant berhasil dihapus");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="categories" />

      <div className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-black mb-0.5">
              Category Management
            </h1>
            <p className="text-gray-400 text-xs">
              Manage product and variant categories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/ecommerce/admin/categories/variants/add"
              className="flex items-center gap-2 bg-white text-black border border-gray-300 px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-xs font-semibold"
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
              Add New Category Variant
            </Link>
            <Link
              to="/ecommerce/admin/categories/add"
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
              Add New Category
            </Link>
          </div>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Product Categories
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {productCategories.length}
                </p>
                <p className="text-gray-400 text-[10px]">All categories</p>
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Active Categories
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {activeCategoriesCount}
                </p>
                <p className="text-gray-400 text-[10px]">Currently active</p>
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

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Variant Categories
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {variantCategories.length}
                </p>
                <p className="text-gray-400 text-[10px]">All variants</p>
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
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-0.5">
                  Total Inactive Categories
                </p>
                <p className="text-2xl font-bold text-black mb-0.5">
                  {inactiveCategoriesCount}
                </p>
                <p className="text-gray-400 text-[10px]">Currently inactive</p>
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
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-black">Product Categories</h2>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-md border border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <p className="text-xs font-semibold text-black">
                          {category.name}
                        </p>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                        {category.description || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-black">
                        {getProductsCountByCategory(category.id)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${getStatusStyle(
                            category.status,
                          )}`}
                        >
                          {category.status.charAt(0).toUpperCase() +
                            category.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                        {new Date(category.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/ecommerce/admin/categories/edit/${category.id}`}
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
                            type="button"
                            onClick={() =>
                              handleDeleteCategory(category.id, category.name)
                            }
                            className="w-7 h-7 flex items-center justify-center border border-red-300 rounded hover:bg-red-50 text-red-600"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination for Product Categories */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              {filteredCategories.length > 0 ? indexOfFirstCategory + 1 : 0} to{" "}
              {Math.min(indexOfLastCategory, filteredCategories.length)} of{" "}
              {filteredCategories.length} categories
            </p>
            {totalCategoryPages > 1 && (
              <div className="flex items-center gap-1.5">
                {/* Previous button */}
                <button
                  onClick={() =>
                    setCurrentCategoryPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentCategoryPage === 1}
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
                {Array.from(
                  { length: totalCategoryPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentCategoryPage(page)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${
                      page === currentCategoryPage
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() =>
                    setCurrentCategoryPage((prev) =>
                      Math.min(prev + 1, totalCategoryPages),
                    )
                  }
                  disabled={currentCategoryPage === totalCategoryPages}
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

        {/* Product Variants Table */}
        <div>
          <h2 className="text-lg font-bold text-black mb-3">
            Product Variants
          </h2>
          <div className="bg-white rounded-md border border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Variant Name
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Variant Value
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentVariants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <p className="text-xs font-semibold text-black">
                          {variant.product?.name || "-"}
                        </p>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                        {variant.variant_name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-black">
                        {variant.variant_value}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-black">
                          {variant.price
                            ? `Rp ${variant.price.toLocaleString("id-ID")}`
                            : "-"}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                        {variant.stock}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/ecommerce/admin/categories/variants/edit/${variant.id}`}
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
                            type="button"
                            onClick={() =>
                              handleDeleteVariant(
                                variant.id,
                                `${variant.variant_name} - ${variant.variant_value}`,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center border border-red-300 rounded hover:bg-red-50 text-red-600"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination for Product Variants */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              {variantCategories.length > 0 ? indexOfFirstVariant + 1 : 0} to{" "}
              {Math.min(indexOfLastVariant, variantCategories.length)} of{" "}
              {variantCategories.length} variants
            </p>
            {totalVariantPages > 1 && (
              <div className="flex items-center gap-1.5">
                {/* Previous button */}
                <button
                  onClick={() =>
                    setCurrentVariantPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentVariantPage === 1}
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
                {Array.from({ length: totalVariantPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentVariantPage(page)}
                      className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-semibold ${
                        page === currentVariantPage
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
                    setCurrentVariantPage((prev) =>
                      Math.min(prev + 1, totalVariantPages),
                    )
                  }
                  disabled={currentVariantPage === totalVariantPages}
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
    </div>
  );
}
