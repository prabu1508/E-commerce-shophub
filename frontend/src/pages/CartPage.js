import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import API from "../api";
import ProductImage from "../components/ProductImage";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      showToast("Please login to continue", "warning");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "warning");
      return;
    }

    try {
      // Create Stripe checkout session
      const { data } = await API.post("/stripe/create-checkout-session", {
        items: cart.map(item => ({
          productId: item._id,
          title: item.title || item.name,
          price: item.price,
          qty: item.qty,
          image: item.image
        })),
        orderMeta: {
          shippingPrice: shipping,
          taxPrice: tax
        }
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      // Prefer a server-provided message (err.response.data.message)
      const serverMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      showToast(serverMessage || "Failed to proceed to checkout", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="text-center bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-200 mb-8">Add some items to your cart to continue shopping</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 hover:shadow-2xl transition-all duration-200"
              >
                <div className="flex gap-4">
                  <ProductImage
                    src={item.image || "https://via.placeholder.com/200x200?text=No+Image"}
                    alt={item.title || item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-white text-lg mb-2">
                      {item.title || item.name}
                    </h2>
                    <p className="text-orange-400 font-bold text-xl mb-4">
                      ₹{item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-white/10 rounded-lg bg-white/2">
                        <button
                          className="px-3 py-1 hover:bg-white/5 transition font-semibold"
                          onClick={() => decreaseQty(item._id)}
                          disabled={item.qty <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 py-1 font-semibold">{item.qty}</span>
                        <button
                          className="px-3 py-1 hover:bg-white/5 transition font-semibold"
                          onClick={() => increaseQty(item._id)}
                        >
                          +
                        </button>
                      </div>

                      <span className="text-white font-semibold">
                        Total: ₹{(item.price * item.qty).toLocaleString()}
                      </span>

                      <button
                        className="ml-auto text-red-400 font-semibold px-3 py-1 rounded hover:bg-white/5 transition"
                        onClick={() => {
                          removeItem(item._id);
                          showToast("Item removed from cart", "info");
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PRICE CARD */}
          <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 h-fit lg:sticky lg:top-20 text-white">
            <h2 className="text-2xl font-bold text-white border-b pb-3 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-white/90 mb-4">
              <div className="flex justify-between">
                <span>Items ({totalItems}):</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax (GST):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>

              <hr className="border-white/10" />

              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total:</span>
                <span className="text-green-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 500 && (
              <p className="text-sm text-blue-400 mb-4">
                Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center mt-4 text-blue-300 hover:text-blue-200 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
