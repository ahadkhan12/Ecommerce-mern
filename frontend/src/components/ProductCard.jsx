import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents clicking the link underlying the card
    if (product.countInStock > 0) {
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
      }, 1);
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Star ratings renderer helper
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-slate-600" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-slate-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full relative group">
      {/* Category Badge */}
      <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200/60 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
        {product.category}
      </span>

      {/* Stock status badge */}
      {product.countInStock === 0 ? (
        <span className="absolute top-4 right-4 z-10 bg-red-50 border border-red-200 text-red-650 text-xs font-bold px-2.5 py-1 rounded-full">
          Sold Out
        </span>
      ) : product.countInStock <= 5 ? (
        <span className="absolute top-4 right-4 z-10 bg-amber-50 border border-amber-250 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
          Only {product.countInStock} Left
        </span>
      ) : null}

      <Link to={`/products/${product._id}`} className="block overflow-hidden relative pt-[75%] bg-slate-100">
        {/* Product image with zoom effect */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Brand */}
        <span className="text-xs text-slate-450 font-medium uppercase tracking-widest mb-1">{product.brand}</span>

        {/* Title */}
        <Link to={`/products/${product._id}`} className="hover:text-primary-500 transition-colors">
          <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex gap-0.5">{renderStars(product.rating)}</div>
          <span className="text-xs text-slate-550 font-medium">({product.numReviews})</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-200/60">
          <span className="text-xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
          {user?.isAdmin ? (
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider bg-amber-50 border border-amber-250 px-2.5 py-1.5 rounded-xl">
              Admin View
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`p-2.5 rounded-xl transition-all border ${
                product.countInStock === 0
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-primary-50 hover:bg-primary-500 border-primary-150 hover:border-primary-500 text-primary-500 hover:text-white shadow active:scale-90'
              }`}
              title="Add to Cart"
            >
              {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
