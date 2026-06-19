import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Key, ClipboardList, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.isAdmin) {
      setLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const response = await fetch('/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User Card (Left) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel border-slate-200/60 rounded-3xl p-6 flex flex-col items-center text-center">
            {/* Avatar avatar */}
            <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-indigo-650 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white shadow-lg mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Profile info fields */}
            <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100/80 px-2.5 py-1 rounded-full mt-1.5 uppercase tracking-wider">
              {user.isAdmin ? 'Store Admin' : 'Customer Member'}
            </span>

            <div className="w-full space-y-4 mt-8 pt-6 border-t border-slate-100 text-left text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="truncate">
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Email Address</span>
                  <span className="text-slate-700 font-medium select-all">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Account ID</span>
                  <span className="text-slate-500 font-mono font-medium">{user._id.substring(0, 12)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History / Admin Panel (Right) */}
        <div className="lg:col-span-3 flex flex-col">
          {user?.isAdmin ? (
            <>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                Administrative Summary
              </h2>
              <div className="glass-panel border-slate-200/60 rounded-3xl p-8 sm:p-12 text-left flex flex-col items-start shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Welcome back to management</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xl font-medium">
                  As an administrator of AURA, you have full dashboard controls. Review store metrics, track customer payments, configure product parameters, and process pending shipments.
                </p>
                <Link
                  to="/admin"
                  className="btn-primary-premium px-6 py-3.5 rounded-xl text-sm flex items-center gap-2"
                >
                  Open Admin Control Center
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                Order History & Tracking
              </h2>

              {loading ? (
                <div className="py-20 flex justify-center">
                  <Loader size="medium" />
                </div>
              ) : error ? (
                <div className="glass-panel border-red-200 text-red-750 bg-red-50 p-6 rounded-2xl">
                  <p className="font-bold">Error loading order history</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="glass-panel border-slate-200/60 text-slate-500 p-16 rounded-3xl text-center">
                  <p className="text-base font-semibold">No orders recorded</p>
                  <p className="text-xs mt-1 text-slate-450">You haven't placed any orders yet.</p>
                  <Link
                    to="/"
                    className="mt-6 btn-primary-premium px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
                  >
                    Go Shop Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full border-collapse text-left text-sm text-slate-650">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Reference ID</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Payment</th>
                        <th className="px-6 py-4">Delivery</th>
                        <th className="px-6 py-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-450 select-all text-xs">
                            {order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-extrabold text-slate-800 font-mono">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                order.isDelivered
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-amber-50 border-amber-200 text-amber-700'
                              }`}
                            >
                              {order.isDelivered ? 'Shipped' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Link
                              to={`/order-success?id=${order._id}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-bold transition-colors focus:outline-none"
                            >
                              <Eye className="w-4 h-4" />
                              View Receipt
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
