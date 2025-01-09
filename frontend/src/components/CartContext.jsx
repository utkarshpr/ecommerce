import React, { createContext, useContext, useState } from 'react';

// Create CartContext
const CartContext = createContext();

// CartContextProvider to wrap the app and provide cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Store cart as an array of { product, quantity }

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product.id === product.id);
      if (existingProduct) {
        // Update quantity if the product already exists
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => useContext(CartContext);
