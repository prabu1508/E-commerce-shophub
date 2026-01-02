import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductImage from "../components/ProductImage";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setSelectedImageIndex(0); // Reset image selection when product changes
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(err.userMessage || "Failed to load product");
        showToast(err.userMessage || "Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showToast]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        name: product.title,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image",
        description: product.description
      });
    }

    showToast(`${quantity} item(s) added to cart!`, "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="text-center bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-300 mb-6">{error || "This product doesn't exist."}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-95 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://via.placeholder.com/800x800?text=No+Image"];
  const mainImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Section : Product Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-white/5 p-6 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm">
              <ProductImage
                src={mainImage}
                alt={product.title}
                className="w-full max-w-md h-96 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all " +
                      (selectedImageIndex === idx
                        ? "border-blue-400 ring-2 ring-blue-300"
                        : "border-gray-600 hover:border-gray-500")
                    }
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Right Section : Product Info */}
          <div className="bg-white/5 p-6 rounded-xl shadow-sm border border-white/10 space-y-6 backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
              {product.brand && (
                <p className="text-gray-300 text-sm">Brand: {product.brand}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-blue-300">₹{product.price}</span>
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-gray-300">
                    {product.rating} ({product.numReviews} reviews)
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-900/20 text-green-300 rounded-full text-sm font-semibold">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-900/20 text-red-300 rounded-full text-sm font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
            {product.description && (
              <div>
                <h3 className="font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}
            {product.category && (
              <div>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                  {product.category}
                </span>
              </div>
            )}
            <hr className="border-gray-700" />
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="font-semibold text-white">Quantity:</label>
              <div className="flex items-center gap-2 border border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-700 transition"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-700 transition"
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </button>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-4 pt-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
