import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use React Router SearchParams to keep filter states in sync with URL queries
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';

  const [keywordInput, setKeywordInput] = useState(searchKeyword);

  useEffect(() => {
    // Sync text input with URL change (e.g. searching from navbar)
    setKeywordInput(searchKeyword);
  }, [searchKeyword]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchKeyword) queryParams.append('keyword', searchKeyword);
      if (activeCategory && activeCategory !== 'all') queryParams.append('category', activeCategory);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load products');
      }
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchKeyword, activeCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (keywordInput) {
        prev.set('search', keywordInput);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const handleCategorySelect = (category) => {
    setSearchParams((prev) => {
      if (category === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', category);
      }
      return prev;
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      prev.set('sortBy', value);
      return prev;
    });
  };

  const resetFilters = () => {
    setKeywordInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-100 mb-12 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-start min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 via-violet-100/20 to-transparent pointer-events-none"></div>
        <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest bg-primary-50 border border-primary-150 px-3 py-1.5 rounded-full mb-4">
          Exclusive Launch
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-2xl leading-[1.1]">
          Elevate Your <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">Digital Space</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-lg">
          Explore a curated selection of premium mechanical keyboards, audiophile gear, and designer wearables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Mobile Filters Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 lg:border-none">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <SlidersHorizontal className="w-5 h-5 text-primary-500" />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-550 hover:text-primary-500 transition-colors flex items-center gap-1 focus:outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>

          {/* Search bar inside filters for mobile/sidebar */}
          <form onSubmit={handleSearchSubmit} className="relative block sm:hidden lg:block">
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary-450 transition-all placeholder:text-slate-400"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-slate-450 hover:text-primary-500 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Categories Filter Block */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Categories</h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/60'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Sorting / Meta row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-850 font-bold">{products.length}</span> products
            </p>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
              <span className="text-sm text-slate-500">Sort by</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-705 focus:outline-none focus:ring-1 focus:ring-primary-450 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid display logic */}
          {loading ? (
            <div className="py-24 flex justify-center">
              <Loader size="large" />
            </div>
          ) : error ? (
            <div className="glass-panel border-red-500/20 text-red-300 p-6 rounded-2xl text-center">
              <p className="font-bold">Error loading catalog</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel text-slate-400 p-16 rounded-3xl text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1 text-slate-500">Try adjusting your filters or search keywords.</p>
              <button
                onClick={resetFilters}
                className="mt-6 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-650 transition-all text-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
