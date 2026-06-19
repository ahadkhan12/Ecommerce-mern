import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Calendar, MapPin, ClipboardList, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="glass-panel border-red-200 text-red-700 bg-red-50 p-8 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold">Error Loading Receipt</h2>
          <p className="mt-2 text-sm">{error || 'Order ID not found'}</p>
          <Link
            to="/"
            className="mt-6 btn-secondary-premium px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Top success icon & header */}
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="p-4 bg-emerald-50 rounded-full border border-emerald-200 mb-6 pulse-glow">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-850 tracking-tight">Order Confirmed!</h1>
        <p className="mt-2 text-slate-500 max-w-sm text-sm">
          Thank you for your purchase. Your order has been placed and is currently being processed.
        </p>
      </div>

      {/* Main receipt glass card */}
      <div className="glass-panel border-slate-200/60 rounded-3xl overflow-hidden shadow-2xl">
        {/* Receipt Header Banner */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
          <div>
            <span className="text-slate-450 font-bold uppercase tracking-wider block">Order Reference ID</span>
            <span className="text-sm font-mono font-bold text-primary-600 select-all">{order._id}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-slate-450 font-bold uppercase tracking-wider block flex items-center sm:justify-end gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date Placed
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Receipt Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100">
          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              Shipping To
            </h3>
            <p className="text-sm text-slate-700 font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment info */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Payment Details
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Payment Method: <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
              <br />
              Payment Status: <span className="font-bold text-emerald-600 uppercase">PAID & SECURED</span>
              <br />
              Transaction Time: <span className="text-slate-600">{new Date(order.paidAt).toLocaleTimeString()}</span>
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-4">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            Purchased Items
          </h3>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm gap-4">
                <div className="flex items-center gap-3 max-w-[75%]">
                  <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="truncate text-slate-700 font-semibold">{item.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-450 block font-semibold">{item.qty} × ${item.price.toFixed(2)}</span>
                  <span className="text-sm font-extrabold text-slate-850 font-mono">${(item.qty * item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing calculations */}
        <div className="p-6 sm:p-8 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          <div className="text-xs text-slate-500">
            A copy of this receipt and shipping updates has been sent to <span className="font-bold text-slate-600">{user.email}</span>.
          </div>
          <div className="flex flex-col gap-2 sm:text-right text-sm">
            <div className="flex justify-between sm:justify-end gap-6 text-slate-500 text-xs">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-700 font-mono">${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-slate-500 text-xs">
              <span>Tax (15%):</span>
              <span className="font-semibold text-slate-700 font-mono">${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-slate-500 text-xs">
              <span>Shipping:</span>
              <span className="font-semibold text-slate-700 font-mono">
                {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-base font-extrabold text-slate-800 pt-2 border-t border-slate-200">
              <span>Amount Paid:</span>
              <span className="text-lg text-primary-600 font-black font-mono">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation options */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Link
          to="/"
          className="w-full sm:w-auto btn-secondary-premium px-6 py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
        <Link
          to="/profile"
          className="w-full sm:w-auto btn-primary-premium px-6 py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          View Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
