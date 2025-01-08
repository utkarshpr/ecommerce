import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For routing
import Alerts from "../Fragments/Alert";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
    // Auto-dismiss alert after 5 seconds
    useEffect(() => {
      if (alert.message) {
        const timer = setTimeout(() => {
          setAlert({ severity: "", message: "" });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [alert]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8081/product/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const { data } = await response.json();
        setProducts(data);
        setAlert({
          severity: "success",
          message: "Products fetched successfully!",
        });
      } catch (error) {
        setAlert({
          severity: "error",
          message: `Error fetching products: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
     {/* Alert Component */}
     {alert.message && <Alerts severity={alert.severity} message={alert.message} />}

    <div className="max-w-3xl mx-auto mb-8 mt-3">
  <input
    type="text"
    placeholder="Search for products..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
  />
</div>

    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
     

      {/* Product List */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300"
          >
            <Link to={`/product/${product.id}`} className="block">
              <img
                src={product.MediaURL[0]}
                alt={product.name}
                className="w-full h-56 object-cover transform group-hover:scale-100 transition-transform duration-500"
              />
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {product.name}</h2>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors duration-300">
              {product.category}</p>
              <p className="text-xl font-bold mt-4 text-gray-800 group-hover:text-gray-950 transition-colors duration-300">
              ₹{(product.price * 83).toFixed(2)} {/* Convert USD to INR */}
              </p>
              <span className="text-sm text-gray-500">In Stock: {product.quantity}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div> 
            </Link>
            
         
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Home;
