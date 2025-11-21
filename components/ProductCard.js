"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Item added to cart!");
      } else {
        toast.error(data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        <span className="text-xs text-blue-600 font-semibold">{product.category}</span>
        <h3 className="text-base sm:text-lg font-bold mt-1 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
