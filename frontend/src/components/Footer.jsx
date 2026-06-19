import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="md:col-span-1">
            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              AURA
            </span>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium">
              Curating high-end tech essentials and lifestyle accessories for developers, creators, and professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-600 transition-colors font-medium">All Products</Link>
              </li>
              <li>
                <Link to="/?category=Keyboards" className="text-sm hover:text-primary-600 transition-colors font-medium">Keyboards</Link>
              </li>
              <li>
                <Link to="/?category=Audio" className="text-sm hover:text-primary-600 transition-colors font-medium">Audio</Link>
              </li>
              <li>
                <Link to="/?category=Wearables" className="text-sm hover:text-primary-600 transition-colors font-medium">Wearables</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm cursor-pointer hover:text-primary-600 transition-colors font-medium">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-sm cursor-pointer hover:text-primary-600 transition-colors font-medium">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm cursor-pointer hover:text-primary-600 transition-colors font-medium">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Newsletter</h3>
            <p className="mt-4 text-sm text-slate-500 font-medium">Subscribe to receive exclusive deals and updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="btn-primary-premium py-2 px-4 rounded-xl text-sm"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-450 font-medium">
          <p>&copy; {new Date().getFullYear()} AURA Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-slate-700 transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-slate-700 transition-colors">GitHub</span>
            <span className="cursor-pointer hover:text-slate-700 transition-colors">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
