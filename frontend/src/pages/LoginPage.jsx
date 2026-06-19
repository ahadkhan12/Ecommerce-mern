import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user, error, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Clear context errors when page mounts
  useEffect(() => {
    clearError();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Form Validations
    if (!email || !password) {
      setLocalError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Errors handled by AuthContext, stored in the context error state
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to your account to continue shopping</p>
          </div>

          {/* Error Banner */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 mb-6 animate-fade-in text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-450" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-400 transition-all text-sm shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-450" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-premium py-3.5 rounded-2xl flex items-center justify-center gap-2 mt-8 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Bottom toggle link */}
          <p className="mt-8 text-center text-sm text-slate-550">
            Don't have an account?{' '}
            <Link
              to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
