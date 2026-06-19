import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* Public Catalog Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Session Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Customer Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Bottom Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
