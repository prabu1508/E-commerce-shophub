import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../components/Toast";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/ProductImage";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const image = product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: product._id,
      name: product.title,
      title: product.title,
      price: product.price,
      image: image,
      description: product.description
    });
    showToast("Added to cart!", "success");
  };

  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 overflow-hidden backdrop-blur-sm">
        <div className="relative overflow-hidden">
          <ProductImage
            src={image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-blue-300 font-bold text-xl">₹{product.price}</p>
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-300">{product.rating}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full mt-3 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-semibold rounded-lg transition disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        params.append("limit", "12");

        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
      } catch (err) {
        showToast(err.userMessage || "Failed to load products", "error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, showToast]);

  const categories = ["electronics", "clothing", "accessories", "home"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-4">
      {/* Banner Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-2xl shadow-lg"
        >
          {[1, 2, 3].map((num) => (
            <SwiperSlide key={num}>
              <div className="w-full h-[420px] rounded-2xl flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 shadow-xl">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4">Special Offer!</h2>
                  <p className="text-xl">Get up to 50% off on selected items</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Category Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/?category=${cat}`}
              className={`shadow rounded-lg p-8 text-center border-2 hover:shadow-lg cursor-pointer transition transform hover:scale-105 bg-gray-800/60 ${
                category === cat ? "border-blue-400" : "border-gray-700"
              }`}
            >
              <div className="text-3xl mb-2">{cat === "electronics" ? "📱" : cat === "clothing" ? "👕" : cat === "accessories" ? "⌚" : "🏠"}</div>
              <div className="font-semibold text-white capitalize">{cat}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">
            {search ? `Search Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "Featured Products"}
          </h2>
          {(search || category) && (
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-200 font-semibold"
            >
              Clear Filters
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h2 className="text-2xl font-semibold mb-2">Stay Updated</h2>
        <p className="mb-6">Subscribe to get special offers & deals.</p>
        <div className="flex justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg border-none text-gray-900 outline-none"
          />
          <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-r-lg font-semibold transition">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}
