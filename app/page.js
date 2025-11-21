"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.products.slice(0, 3));
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Welcome to SheopurStationaryHub - Best Stationery Shop in Sheopur
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 px-4">
              Buy premium quality office supplies, notebooks, pens, and stationery products online in Sheopur. Fast delivery, best prices, 100% satisfaction guaranteed.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-sm sm:text-base"
              aria-label="Browse our stationery products"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50" aria-label="Our Features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why Choose SheopurStationaryHub?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <article className="text-center p-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4" aria-hidden="true">🚚</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Free Shipping in Sheopur</h3>
              <p className="text-sm sm:text-base text-gray-600">Fast delivery on orders over ₹500</p>
            </article>
            <article className="text-center p-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4" aria-hidden="true">⭐</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Premium Quality Products</h3>
              <p className="text-sm sm:text-base text-gray-600">Best stationery items in Sheopur</p>
            </article>
            <article className="text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4" aria-hidden="true">💯</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">100% Satisfaction Guaranteed</h3>
              <p className="text-sm sm:text-base text-gray-600">Money-back guarantee on all products</p>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16" aria-label="Featured Products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Featured Stationery Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={{ ...product, id: product._id }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl sm:text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-sm sm:text-base">No products available yet</p>
            </div>
          )}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 px-4">
            Join thousands of satisfied customers today
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
