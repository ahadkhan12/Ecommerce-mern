import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ListOrdered, Users, DollarSign, Plus, Edit, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { API_BASE } from '../config';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Route guard: Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Dashboard states
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loaded database states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal states for creating/editing product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states for Product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };

      // 1. Fetch Products
      const prodRes = await fetch(`${API_BASE}/api/products`);
      const prodData = await prodRes.json();
      if (!prodRes.ok) {
        throw new Error(prodData.message || 'Failed to fetch products');
      }
      setProducts(prodData.products || []);

      // 2. Fetch Orders
      const orderRes = await fetch(`${API_BASE}/api/orders`, { headers });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to fetch orders');
      }
      setOrders(Array.isArray(orderData) ? orderData : []);

      // 3. Fetch Users
      const userRes = await fetch(`${API_BASE}/api/auth/users`, { headers });
      const userData = await userRes.json();
      if (!userRes.ok) {
        throw new Error(userData.message || 'Failed to fetch users');
      }
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setOrders([]);
      setUsers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchDashboardData();
    }
  }, [user]);

  // Form modal opening utilities
  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setBrand('');
    setCategory('');
    setImage('/images/keyboard.jpg'); // default seeded path
    setCountInStock('10');
    setDescription('');
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
    setImage(product.image);
    setCountInStock(product.countInStock);
    setDescription(product.description);
    setShowProductModal(true);
  };

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      price: Number(price),
      brand,
      category,
      image,
      countInStock: Number(countInStock),
      description,
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      setShowProductModal(false);
      fetchDashboardData(); // Refresh lists
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        fetchDashboardData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Order Delivery status handler
  const handleMarkAsDelivered = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update delivery status');
      }

      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const averageOrderVal = orders.length > 0 ? totalRevenue / orders.length : 0;

  if (!user || !user.isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-8 h-8 text-primary-600" />
            Admin Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage products catalog, view customer sales, and ship orders</p>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Metric 1 */}
        <div className="glass-panel border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Orders Logged</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{orders.length}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Products Catalog</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{products.length}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'products'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" /> Products Catalog
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ListOrdered className="w-4 h-4" /> Store Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" /> Users Management
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="large" />
        </div>
      ) : error ? (
        <div className="glass-panel border-red-200 p-6 text-red-700 bg-red-50 rounded-2xl text-center">
          <p className="font-bold">Error loading dashboard</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Tab 1: Products Panel */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800">All Catalog Products</h3>
                <button
                  onClick={openCreateModal}
                  className="btn-primary-premium text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Product
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Thumbnail</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Brand</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-100" />
                        </td>
                        <td className="px-6 py-3 font-bold text-slate-800 truncate max-w-[200px]" title={prod.name}>
                          {prod.name}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-600">{prod.brand}</td>
                        <td className="px-6 py-3">
                          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200/50">{prod.category}</span>
                        </td>
                        <td className="px-6 py-3 font-extrabold font-mono text-slate-800">${prod.price.toFixed(2)}</td>
                        <td className="px-6 py-3 font-mono font-semibold text-slate-700">{prod.countInStock}</td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 text-slate-450 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProductDelete(prod._id)}
                              className="p-1.5 text-slate-450 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Orders Panel */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-450 text-xs select-all">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{order.user?.name || 'Deleted User'}</div>
                        <div className="text-xs text-slate-450">{order.user?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-black font-mono text-slate-800">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            order.isDelivered
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >
                          {order.isDelivered ? 'Delivered' : 'Pending Shipment'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleMarkAsDelivered(order._id)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Ship Order
                          </button>
                        )}
                        {order.isDelivered && (
                          <span className="text-xs text-slate-400 font-medium">Shipped on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Users Panel */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Account ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-450">{u._id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                      <td className="px-6 py-4 select-all text-slate-650">{u.email}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            u.isAdmin
                              ? 'bg-primary-50 border-primary-200 text-primary-700'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {u.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical Keyboard Pro"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 shadow-sm transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Stock Count</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razer"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 shadow-sm transition-all"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keyboards"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 shadow-sm transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* Image path */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Product Image URI</label>
                <input
                  type="text"
                  required
                  placeholder="/images/keyboard.jpg"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono shadow-sm transition-all"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter detailed description..."
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 shadow-sm transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit Modal */}
              <button
                type="submit"
                className="w-full btn-primary-premium py-3 rounded-xl flex items-center justify-center gap-1.5 mt-6"
              >
                <Check className="w-5 h-5" />
                {editingProduct ? 'Update Product Details' : 'Create Product Catalog Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
