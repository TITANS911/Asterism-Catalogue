import SidebarAdmin from "../../../../components/sidebarAdmin";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";
const GENDER_OPTIONS = ["men", "women", "kids"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Simpan file asli

  // State untuk form utama
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    category_id: "",
    gender: [],
    price: 0,
    discount_price: null,
    sku: "",
    stock: 0,
    weight: null,
    dimensions: "",
    featured_image: "",
    images: [],
    tags: [],
    is_featured: false,
    status: "active",
  });

  // State untuk product variants
  const [productVariants, setProductVariants] = useState([
    {
      id: null,
      variant_name: "",
      variant_value: "",
      price: 0,
      stock: 0,
      sku: "",
      image: null,
    },
  ]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/product-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success && result.data.categories) {
        setCategories(result.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler untuk file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setUploadedFiles(files);
      setImagePreview(previewUrls);
    }
  };

  // Handler untuk perubahan input form utama
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "gender") {
      setFormData((prev) => ({
        ...prev,
        gender: checked
          ? [...prev.gender, value]
          : prev.gender.filter((item) => item !== value),
      }));
      return;
    }

    if (name === "price" || name === "discount_price") {
      let processedValue = value.replace(/[^0-9]/g, "");
      if (processedValue.startsWith("0") && processedValue.length > 1) {
        processedValue = processedValue.replace(/^0+/, "") || "0";
      }
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "discount_price" && processedValue === ""
            ? null
            : Number(processedValue),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value) || 0
            : value,
    }));
  };

  // Handler untuk perubahan variant
  const handleVariantChange = (index, field, value) => {
    setProductVariants((prev) => {
      const newVariants = [...prev];
      if (field === "price") {
        // Handle price sama seperti form utama
        let processedValue = value.toString().replace(/[^0-9]/g, "");
        if (processedValue.startsWith("0") && processedValue.length > 1) {
          processedValue = processedValue.replace(/^0+/, "") || "0";
        }
        newVariants[index][field] = Number(processedValue) || 0;
      } else if (field === "stock") {
        // Stock hanya menerima angka, dan tidak boleh negatif
        let processedValue = value.toString().replace(/[^0-9]/g, "");
        newVariants[index][field] = Number(processedValue) || 0;
      } else {
        newVariants[index][field] = value;
      }
      return newVariants;
    });
  };

  // Tambah variant baru
  const addVariant = () => {
    setProductVariants((prev) => [
      ...prev,
      {
        id: null,
        variant_name: "",
        variant_value: "",
        price: formData.price,
        stock: 0,
        sku: "",
        image: null,
      },
    ]);
  };

  // Hapus variant
  const removeVariant = (index) => {
    if (productVariants.length > 1) {
      setProductVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Filter variant yang memiliki variant_name dan variant_value
      const validVariants = productVariants.filter(
        (v) => v.variant_name && v.variant_value,
      );

      // Buat FormData
      const formDataToSend = new FormData();

      // Tambahkan semua field formData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (
            (key === "tags" || key === "gender") &&
            Array.isArray(formData[key])
          ) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (key !== "images" && key !== "featured_image") {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Tambahkan file upload
      uploadedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Tambahkan variants
      if (validVariants.length > 0) {
        formDataToSend.append("variants", JSON.stringify(validVariants));
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambah produk");
      }

      alert("Produk berhasil ditambahkan!");
      navigate("/ecommerce/admin/products");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SidebarAdmin activePage="products" />

      <div className="ml-64 p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-black mb-0.5">
                Add New Product
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Link
                  to="/ecommerce/admin/products"
                  className="hover:text-black transition-colors"
                >
                  Product Management
                </Link>
                <span>/</span>
                <span>Add New Product</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/ecommerce/admin/products"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold disabled:opacity-50"
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
                    d="M8 7H5a2 2 0 00-2 2 v9a2 2 0 002 2 h14a2 2 0 002-2 V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Form Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-sm font-semibold text-black mb-3">
                  Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Product Category
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Gender Filter
                    </label>
                    <div className="flex flex-wrap gap-3 border border-gray-300 rounded-md px-3 py-2">
                      {GENDER_OPTIONS.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-xs text-black"
                        >
                          <input
                            type="checkbox"
                            name="gender"
                            value={option}
                            checked={formData.gender.includes(option)}
                            onChange={handleChange}
                            className="w-3.5 h-3.5 border-gray-300 text-black focus:ring-black"
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleChange}
                      placeholder="Enter short description"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Long Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter product description"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="bg-white p-4 rounded-md border border-gray-300">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-semibold text-black">
                    Product Variants
                  </h2>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-semibold text-gray-700"
                  >
                    <svg
                      className="w-3 h-3"
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
                    Add Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {productVariants.map((variant, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-3 relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Variant {index + 1}
                        </span>
                        {productVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Type
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Size"
                            value={variant.variant_name}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "variant_name",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            placeholder="ex: M"
                            value={variant.variant_value}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "variant_value",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Rp
                            </span>
                            <input
                              type="text"
                              placeholder="0"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Stock
                          </label>
                          <input
                            type="text"
                            placeholder="0"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            SKU
                          </label>
                          <input
                            type="text"
                            placeholder="ex: PROD-SIZE-M-001"
                            value={variant.sku}
                            onChange={(e) =>
                              handleVariantChange(index, "sku", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-400">
                  Note: Jika produk tidak memiliki varian, cukup isi 1 varian
                  saja
                </p>
              </div>
            </div>

            {/* Sidebar Form */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-sm font-semibold text-black mb-3">
                  Product Image
                </h2>

                {/* Display selected images */}
                {imagePreview && imagePreview.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Selected Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreview.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-20 object-cover rounded border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <label className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                  {imagePreview && imagePreview.length > 0 ? (
                    <img
                      src={imagePreview[0]}
                      alt="Preview"
                      className="w-full h-40 object-contain mx-auto mb-2"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 mx-auto text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                  <p className="text-xs text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[10px] text-gray-400">
                    PNG, JPG up to 10 MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-sm font-semibold text-black mb-3">
                  Pricing & Inventory
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Regular Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Discount Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="discount_price"
                        value={formData.discount_price || ""}
                        onChange={handleChange}
                        placeholder="0 (optional)"
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      Leave empty if no discount
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
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
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      Inactive products will not be visible to customers
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-xs text-gray-600">
                        Featured Product
                      </span>
                    </label>
                    <p className="text-[9px] text-gray-400 mt-0.5 ml-5.5">
                      Show this product on homepage
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="weight"
                      value={formData.weight || ""}
                      onChange={handleChange}
                      placeholder="Enter weight (optional)"
                      min="0"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="ex: 20x15x5 cm"
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
