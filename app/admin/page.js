"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("add");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem("isAdmin");
      const adminToken = localStorage.getItem("adminToken");
      
      if (!isAdmin || !adminToken) {
        router.replace("/admin/login");
        return;
      }
      
      setIsAuthenticated(true);
      setIsChecking(false);
      fetchProducts();
      fetchCategories();
      fetchOrders();
    };

    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const fetchOrders = async () => {
    const adminToken = localStorage.getItem("adminToken");
    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const adminToken = localStorage.getItem("adminToken");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order status updated successfully!");
        fetchOrders();
      } else {
        setError(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Update order status error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Please enter category name");
      return;
    }

    const adminToken = localStorage.getItem("adminToken");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category added successfully!");
        setNewCategory("");
        setShowCategoryModal(false);
        fetchCategories();
      } else {
        setError(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Add category error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    const adminToken = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        setError(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("adminToken");

    if (!formData.category) {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    if (!formData.image) {
      setError("Please upload a product image");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          quantity: formData.quantity,
          category: formData.category,
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: "",
          image: "",
        });
        setImagePreview(null);
        setImageFile(null);
        fetchProducts();
        setTimeout(() => setActiveTab("view"), 1500);
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      setError("Network error. Please try again.");
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-xl text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your products</p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold transition text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === "add"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              ➕ Add Product
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold transition text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === "view"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              📦 Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold transition text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === "categories"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              📁 Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold transition text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              📋 Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Add Product Tab */}
        {activeTab === "add" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Premium Notebook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity in Stock *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                    >
                      ➕ Add New
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg mb-3"
                        />
                        <p className="text-sm text-blue-600 hover:text-blue-700">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-6xl mb-3">📷</div>
                        <p className="text-gray-600 mb-2">Click to upload product image</p>
                        <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* View Products Tab */}
        {activeTab === "view" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">All Products</h2>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 text-lg">No products added yet</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.description.substring(0, 50)}...</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-blue-600">
                          ₹{product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            product.quantity > 10 
                              ? "bg-green-100 text-green-800" 
                              : product.quantity > 0 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {product.quantity} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Categories</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ Add Category
              </button>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600 text-lg">No categories added yet</p>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-blue-500 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        Added {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Orders</h2>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl sm:text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-base sm:text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Order ID: {order._id}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold mt-1">
                          Customer: {order.userId?.name || 'N/A'} ({order.userId?.email || 'N/A'})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border-2 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">Order Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2 text-xs sm:text-sm">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                          />
                          <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {order.shippingAddress && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Shipping Address:</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{order.shippingAddress.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{order.shippingAddress.phone}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                      <span className="font-bold text-base sm:text-lg">Total Amount:</span>
                      <span className="font-bold text-base sm:text-lg text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Add New Category</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Category
                </button>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory("");
                    setError("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
