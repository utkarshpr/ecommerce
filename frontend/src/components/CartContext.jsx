import React, { createContext, useContext, useState, useEffect } from 'react';

// Create CartContext
const CartContext = createContext();

// CartContextProvider to wrap the app and provide cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Store cart as an array of { product_id, quantity, is_special_request, special_request_details }
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [quantity,setQuantity]=useState(0)

  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  };

  const getCartItems = async () => {
    const token = getTokenFromCookies();
    if (token) {
      try {
        const response = await fetch('http://localhost:8081/cart/getAll', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.Status) {
           console.log(result.data);
            
          setCart(result.data.orders); // Store the fetched cart data (orders array) in the state
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
  };


  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + parseInt(item.quantity, 10), 0);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getCartItems(); // Fetch cart items when the user logs in
    }
  }, [isLoggedIn]); // This effect depends on `isLoggedIn`

  // You can trigger this function whenever you want to fetch the cart items manually
  const fetchCartItemsOnDemand = () => {
    getCartItems(); // This triggers a manual fetch of cart items
  };
  return (
    <CartContext.Provider value={{ cart, getCartItemCount, setIsLoggedIn,fetchCartItemsOnDemand }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => useContext(CartContext);
