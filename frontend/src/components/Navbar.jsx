import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
    } else {
      navigate(`/?search=${keyword}`);
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-lg border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-primary-600 via-indigo-650 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              AURA
            </Link>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md relative hidden sm:block"
          >
            <input
              type="text"
              placeholder="Search premium products..."
              className="w-full bg-slate-100 border border-slate-200 text-slate-800 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-transparent transition-all placeholder:text-slate-400 focus:bg-white"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-slate-450 hover:text-primary-500 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Cart Link */}
            {(!user || !user.isAdmin) && (
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-600 hover:text-primary-500 hover:bg-slate-100 rounded-xl transition-all flex items-center"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalCartQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-650 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {totalCartQty}
                  </span>
                )}
              </Link>
            )}

            {/* Auth section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 rounded-xl transition-all focus:outline-none"
                >
                  <UserCheck className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium hidden md:inline truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-xl py-1 border border-slate-100 animate-fade-in">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-605 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors border-t border-slate-100"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-slate-50 hover:text-red-600 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-primary-505 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-primary-500/10 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
