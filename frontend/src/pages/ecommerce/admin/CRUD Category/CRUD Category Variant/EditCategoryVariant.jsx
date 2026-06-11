import SidebarAdmin from "../../../../../components/sidebarAdmin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

export default function EditCategoryVariant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  // State untuk form
  const [formData, setFormData] = useState({
    product_id: "",
    variant_name: "",
    variant_value: "",
    price: "",
    stock: "",
    sku: "",
    image: "",
  });

  // Fetch products and variant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Anda harus login terlebih dahulu");
        }

        // Fetch products
        const productsResponse = await fetch(`${API_URL}/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const productsData = await productsResponse.json();
        if (productsResponse.ok && productsData.data) {
          setProducts(productsData.data.products || productsData.data || []);
        }

        // Fetch variant data
        const variantResponse = await fetch(
          `${API_URL}/product-variants/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const variantData = await variantResponse.json();

        if (!variantResponse.ok) {
          throw new Error(
            variantData.message || "Gagal mengambil data variant",
          );
        }

        if (variantData.data) {
          setFormData({
            product_id: variantData.data.product_id || "",
            variant_name: variantData.data.variant_name || "",
            variant_value: variantData.data.variant_value || "",
            price: variantData.data.price || "",
            stock: variantData.data.stock || "",
            sku: variantData.data.sku || "",
            image: variantData.data.image || "",
          });
        }
      } catch (err) {
        setError(err.message);
        alert(err.message);
      }
    };

    fetchData();
  }, [id]);

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Anda harus login terlebih dahulu");
      }

      const response = await fetch(`${API_URL}/product-variants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: parseInt(formData.product_id),
          variant_name: formData.variant_name,
          variant_value: formData.variant_value,
          price: formData.price ? parseFloat(formData.price) : null,
          stock: formData.stock ? parseInt(formData.stock) : 0,
          sku: formData.sku || null,
          image: formData.image || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate variant");
      }

      alert("Variant produk berhasil diupdate!");
      navigate("/ecommerce/admin/categories");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="categories" />

      <div className="ml-64 p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-black mb-0.5">
                Edit Category Variant
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Link
                  to="/ecommerce/admin/categories"
                  className="hover:text-black transition-colors"
                >
                  Category Management
                </Link>
                <span>/</span>
                <span>Edit Category Variant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/ecommerce/admin/categories"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Update Variant
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-sm font-semibold text-black mb-3">
                  Variant Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Product
                    </label>
                    <select
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      name="variant_name"
                      value={formData.variant_name}
                      onChange={handleChange}
                      placeholder="e.g., Size, Color"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Variant Value
                    </label>
                    <input
                      type="text"
                      name="variant_value"
                      value={formData.variant_value}
                      onChange={handleChange}
                      placeholder="e.g., S, M, L"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Price (optional)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter stock"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      SKU (optional)
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Enter SKU"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
