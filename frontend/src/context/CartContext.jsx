import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Load cart data and shipping address on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
        localStorage.removeItem('cartItems');
      }
    }

    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error('Failed to parse shipping address', e);
        localStorage.removeItem('shippingAddress');
      }
    }
  }, []);

  // Sync cart items to localStorage on change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

  // Add to cart helper
  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product.product);

      if (existItem) {
        return prevItems.map((x) =>
          x.product === product.product ? { ...x, qty: Number(qty) } : x
        );
      } else {
        return [...prevItems, { ...product, qty: Number(qty) }];
      }
    });
  };

  // Remove from cart helper
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  // Save shipping address
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Dynamically calculate totals
  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );
  const shippingPrice = Number((itemsPrice > 150 ? 0 : 15).toFixed(2));
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
