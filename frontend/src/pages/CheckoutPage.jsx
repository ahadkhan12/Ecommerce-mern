import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const CheckoutPage = () => {
  const { cartItems, itemsPrice, taxPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form input formatter helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Shipping validations
    if (!address || !city || !postalCode || !country) {
      setLocalError('Please complete all shipping address fields');
      return;
    }

    // Payment validation
    if (cardNumber.length !== 16) {
      setLocalError('Invalid Card Number: Must be 16 digits');
      return;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(cardExpiry)) {
      setLocalError('Invalid Expiration Date: Must match MM/YY format');
      return;
    }

    if (cardCvv.length !== 3) {
      setLocalError('Invalid CVV: Must be 3 digits');
      return;
    }

    // Submit Order
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item.product,
          })),
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
          },
          paymentMethod: 'Mock Card Payment',
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Order created successfully!
      clearCart(); // Clear cart items
      setLoading(false);
      navigate(`/order-success?id=${data._id}`);
    } catch (err) {
      setLocalError(err.message);
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-slate-500">No items to checkout. Cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-primary-premium px-6 py-2.5 rounded-xl"
        >
          Go back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Fields (Left) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Error display */}
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          {/* Shipping Address Panel */}
          <div className="glass-panel border-slate-200/60 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary-600" />
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="123 Developer Way"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Silicon Valley"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="United States"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="94025"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Details Panel */}
          <div className="glass-panel border-slate-200/60 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              Payment Information
            </h2>
            <p className="text-xs text-slate-500 mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
              Secure Checkout: Enter any mock card detail to complete test checkout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card Number */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm font-mono tracking-wider shadow-sm"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>

              {/* Expiration Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Expiration Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm font-mono shadow-sm"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                />
              </div>

              {/* CVV */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm font-mono shadow-sm"
                  value={cardCvv}
                  onChange={handleCvvChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary Sidebar (Right) */}
        <div className="lg:col-span-1">
          <div className="glass-panel border-slate-200/60 rounded-3xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Order Summary</h2>

            {/* List items briefly */}
            <div className="space-y-3 mt-4 max-h-[180px] overflow-y-auto pr-1 pb-4 border-b border-slate-100">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                    <span className="truncate text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-semibold font-mono">
                    {item.qty} × ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 mt-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between text-sm text-slate-555 text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-555 text-slate-500">
                <span>Estimated Tax (15%)</span>
                <span className="font-semibold text-slate-800">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-555 text-slate-500">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800">
                  {shippingPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-800 mt-6 mb-8">
              <span>Total Price</span>
              <span className="text-xl text-primary-600 font-black">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-premium py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader size="small" className="py-0.5" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Place Mock Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
