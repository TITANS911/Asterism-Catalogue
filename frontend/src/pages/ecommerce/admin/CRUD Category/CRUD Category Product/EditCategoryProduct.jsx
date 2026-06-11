import SidebarAdmin from "../../../../../components/sidebarAdmin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

export default function EditCategoryProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  // State untuk form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: "",
    is_featured: false,
  });

  // Load data kategori saat komponen mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Anda harus login terlebih dahulu");
        }

        const response = await fetch(`${API_URL}/product-categories/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data kategori");
        }

        if (data.data) {
          setFormData({
            name: data.data.name || "",
            description: data.data.description || "",
            status: data.data.status || "active",
            image: data.data.image || "",
            is_featured:
              data.data.is_featured === true ||
              data.data.is_featured === 1 ||
              data.data.is_featured === "1" ||
              data.data.is_featured === "true",
          });
          setImagePreview(data.data.image || "");
        }
      } catch (err) {
        setError(err.message);
        alert(err.message);
      }
    };

    fetchCategory();
  }, [id]);

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : formData.image || "");
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

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("status", formData.status);
      payload.append("image", formData.image || "");
      payload.append("is_featured", String(formData.is_featured));

      if (uploadedFile) {
        payload.set("image", uploadedFile);
      }

      const response = await fetch(`${API_URL}/product-categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate kategori");
      }

      alert("Kategori produk berhasil diupdate!");
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
                Edit Category Product
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Link
                  to="/ecommerce/admin/categories"
                  className="hover:text-black transition-colors"
                >
                  Category Management
                </Link>
                <span>/</span>
                <span>Edit Category Product</span>
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
                    Update Category
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
                  Category Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter category description"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Category Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black file:mr-3 file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white"
                    />
                    {imagePreview && (
                      <div className="mt-3 w-40 h-40 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt="Category preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Form */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-sm font-semibold text-black mb-3">
                  Publish Settings
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      Inactive categories will not be available for products
                    </p>
                  </div>
                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="mt-0.5 w-3.5 h-3.5 border-gray-300 text-black focus:ring-black"
                      />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                          Show In Featured
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          Category yang dicentang akan tampil pada card Featured
                          di halaman ecommerce.
                        </p>
                      </div>
                    </label>
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
