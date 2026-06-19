import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Heart, Check, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Check if item already exists in the cart to sync initial quantity selection
  const cartItem = cartItems.find((x) => x.product === id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data);
        // Set quantity to current cart quantity or default to 1
        if (cartItem) {
          setQty(cartItem.qty);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, cartItem]);

  const handleAddToCart = () => {
    if (product.countInStock > 0) {
      addToCart(
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
        },
        qty
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Star ratings helper
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating || 0);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-slate-600" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-slate-600" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel border-red-500/20 text-red-300 p-8 rounded-3xl">
          <h2 className="text-xl font-bold">Error</h2>
          <p className="mt-2 text-sm">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl border border-slate-700 transition-all text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 font-medium focus:outline-none cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      {/* Main product card detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Side: Product Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200/60 aspect-square group bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-2xl font-bold text-red-500 bg-white border border-red-200 px-6 py-3 rounded-2xl shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Purchase Panel */}
        <div className="flex flex-col">
          {/* Tag & Category */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-50 border border-primary-150 text-primary-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-sm text-slate-455 font-medium">{product.brand}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Reviews Rating summary */}
          <div className="flex items-center gap-2 mt-4 pb-6 border-b border-slate-200/60">
            <div className="flex gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-sm font-semibold text-slate-700 ml-1">{product.rating}</span>
            <span className="text-sm text-slate-500">({product.numReviews} customer reviews)</span>
          </div>

          {/* Pricing & Stock block */}
          <div className="flex items-baseline gap-4 mt-6">
            <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-550">or 3 interest-free payments of ${(product.price / 3).toFixed(2)}</span>
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed text-base">
            {product.description}
          </p>

          {/* Purchase Actions Frame */}
          <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Availability Status</span>
              <span
                className={`text-sm font-bold flex items-center gap-1.5 ${
                  product.countInStock > 0 ? 'text-emerald-650' : 'text-red-655'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Purchase Controls (Disabled for Admins) */}
            {user?.isAdmin ? (
              <div className="bg-amber-950/30 border border-amber-900/35 text-amber-500 rounded-2xl p-4 text-xs flex items-center gap-3">
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  <strong>Admin Mode:</strong> Shopping actions are disabled for administrator profiles. Manage product parameters or stock levels from the Admin Panel.
                </span>
              </div>
            ) : (
              <>
                {/* Quantity Selector (Only if in stock) */}
                {product.countInStock > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 font-medium">Order Quantity</span>
                    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/65 rounded-xl px-2 py-1">
                      <button
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        className="p-2 text-slate-400 hover:text-slate-200 focus:outline-none font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm text-slate-100 font-bold px-3 select-none">{qty}</span>
                      <button
                        onClick={() => setQty((prev) => Math.min(product.countInStock, prev + 1))}
                        className="p-2 text-slate-400 hover:text-slate-200 focus:outline-none font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Trigger */}
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                    className={`flex-1 flex items-center justify-center gap-3 font-semibold px-6 py-4 rounded-2xl transition-all border ${
                      product.countInStock === 0
                        ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-primary-600 hover:bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-900/35 hover:shadow-primary-600/40 active:scale-[0.98]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" />
                        Updated in Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Shopping Cart
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
