import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    addToCart,
    removeFromCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQtyChange = (item, newQty) => {
    const qty = Math.max(1, Math.min(item.countInStock, newQty));
    addToCart(item, qty);
  };

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="glass-panel border-slate-200/60 p-12 sm:p-16 rounded-3xl flex flex-col items-center">
          <div className="p-4 bg-slate-100 rounded-full border border-slate-200 mb-6">
            <ShoppingBag className="w-12 h-12 text-primary-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Your shopping cart is empty</h2>
          <p className="mt-2 text-slate-500 max-w-sm text-sm">
            Looks like you haven't added any products to your cart yet. Let's find some premium gear!
          </p>
          <Link
            to="/"
            className="mt-8 btn-primary-premium px-6 py-3 rounded-xl flex items-center gap-2 text-sm"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list (Left) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-panel border-slate-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-slate-300"
            >
              {/* Product thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Title & info */}
              <div className="flex-1 text-center sm:text-left">
                <Link
                  to={`/products/${item.product}`}
                  className="text-base font-bold text-slate-800 hover:text-primary-600 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                  <span className="text-sm text-slate-500 font-medium">${item.price.toFixed(2)} each</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-xs text-slate-450">Max stock: {item.countInStock}</span>
                </div>
              </div>

              {/* Quantity modifiers & removal */}
              <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-0.5">
                  <button
                    onClick={() => handleQtyChange(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:text-slate-305 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-slate-700 px-2 select-none">{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:text-slate-305 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for item */}
                <span className="text-base font-extrabold text-slate-800 min-w-[70px] text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary (Right) */}
        <div className="lg:col-span-1">
          <div className="glass-panel border-slate-200/60 rounded-3xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Order Summary</h2>

            <div className="space-y-3.5 mt-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Estimated Tax (15%)</span>
                <span className="font-semibold text-slate-800">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800">
                  {shippingPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-slate-500 bg-primary-50/50 border border-primary-100/50 p-2.5 rounded-xl">
                  Add <span className="font-bold text-primary-600">${(150 - itemsPrice).toFixed(2)}</span> more to your order for <span className="font-bold text-emerald-600">FREE SHIPPING</span>!
                </p>
              )}
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-800 mt-6 mb-8">
              <span>Total Price</span>
              <span className="text-xl text-primary-600 font-black">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary-premium py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center text-xs text-slate-500 hover:text-slate-800 transition-colors mt-4 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
