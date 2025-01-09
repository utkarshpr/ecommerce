import React, { useState, useEffect } from "react";
import Alerts from "../Fragments/Alert";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const { action } = location.state || {};

    if (action === "addToCart") {
      // Perform Add to Cart logic
      setAlert({ severity: "success", message: "Added to cart!" });
    } else if (action === "buyNow") {
      // Perform Buy Now logic
      setAlert({ severity: "success", message: "Proceeding to checkout!" });
      navigate("/checkout");
    }
  }, [location.state]);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-dismiss alert after 5 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ severity: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/product/get?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const { data } = await response.json();

        setProduct(data);
        setAlert({
          severity: "success",
          message: "Product fetched successfully!",
        });
      } catch (error) {
        setAlert({
          severity: "error",
          message: `Error fetching product: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Auto-playing carousel logic
  useEffect(() => {
    if (product?.MediaURL?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % product.MediaURL.length
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup interval
    }
  }, [product]);

  const handleAction = (action) => {
    if (!isLoggedIn) {
      // Redirect to login with 'from' and 'action'
      console.log("Navigating to login with state:", {
        from: `/product/${id}`,
        action,
      });

      navigate("/login", {
        state: { from: `/product/${id}`, action },
      });
    } else {
      if (action === "addToCart") {
        setAlert({ severity: "success", message: "Added to cart!" });
        setShowQuantityModal(true);
      } else if (action === "buyNow") {
        setAlert({ severity: "success", message: "Proceeding to checkout!" });
        navigate("/checkout");
      }
    }
  };

  // add to cart 

  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  }; 

  const handleSubmitQuantity = async () => {
    
    const requestData = {
      orders: [
        {
          product_id: product.id,
          quantity: quantity.toString(),
          is_special_request: false,
        },
      ],
      added_at: new Date().toISOString(),
    };

    console.log(requestData);
    
    const token = getTokenFromCookies(); // Retrieve the authToken from cookies
    try {
      const response = await fetch("http://localhost:8081/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setAlert({ severity: "success", message: "Added to cart!" });
        setShowQuantityModal(false); // Close the modal
      } else {
        setAlert({ severity: "error", message: "Failed to add to cart." });
      }
    } catch (error) {
      setAlert({ severity: "error", message: `Error: ${error.message}` });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  const usdToInr = 83; // Example exchange rate, update as per current rate
  const priceInINR = (product.price * usdToInr).toFixed(2);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Alert Component */}
      {alert.message && (
        <Alerts severity={alert.severity} message={alert.message} />
      )}

      {/* Main Content */}
      {product && (
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Carousel Section */}
          <div className="relative w-full h-96">
            <div className="overflow-hidden w-full h-full">
              <img
                src={product.MediaURL[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 transform hover:scale-110"
              />
            </div>
            {product.MediaURL.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {product.MediaURL.map((_, index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-blue-400"
                    } transition duration-300`}
                  ></span>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-wide">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{product.category}</p>
            {/* Rating Section */}
            <div className="flex items-center mt-4">
              <div className="flex items-center">
                {/* Displaying the rating */}
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index < product.rating ? "yellow" : "gray"}
                    viewBox="0 0 20 20"
                    className="w-5 h-5 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.27l4.45 2.33-1.12-4.75L18 7.5h-5.2L10 2 7.2 7.5H2l3.67 5.35-1.12 4.75L10 15.27z"
                    />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600 text-sm">
                {product.rating} (126 ratings)
              </span>
            </div>
            <p className="text-gray-700 mt-4 text-base md:text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Dummy Description */}
            <p className="text-gray-500 mt-4 text-sm md:text-base leading-relaxed">
              "This is a dummy description. The product offers high-quality
              sound, long battery life, and exceptional portability. Perfect for
              anyone on the go who wants to enjoy music anytime, anywhere. The
              speaker is compatible with a wide range of devices and comes in a
              sleek, modern design."
            </p>

            <div className="flex flex-wrap items-center mt-6 space-x-6">
              <p className="text-gray-900 font-semibold text-xl md:text-2xl">
                ₹{priceInINR}
              </p>
              <span className="ml-4 text-sm text-gray-500">
                ({product.quantity} in stock)
              </span>
            </div>

            <p className="text-gray-700 mt-2 text-base">
              <span className="font-semibold">Supplier:</span>{" "}
              {product.supplier}
            </p>
            <p className="text-gray-700 mt-2 text-base">
              <span className="font-semibold">Weight:</span> {product.weight} kg
            </p>
            <p className="text-gray-700 mt-2 text-base">
              <span className="font-semibold">Dimensions:</span>{" "}
              {product.dimensions}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => handleAction("addToCart")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleAction("buyNow")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              >
                Buy Now
              </button>
            </div>
            <div>
              <div className="mt-16 px-4 md:px-12">
                <h2 className="text-2xl font-bold text-[#4A4E69] mb-4">
                  Customer Reviews
                </h2>

                {/* Review 1 */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <p className="text-lg font-semibold text-[#333333]">
                        John Doe
                      </p>
                      <p className="text-sm text-[#9A8C98]">2 days ago</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[#333333]">
                      "The Bluetooth speaker is amazing! The sound quality is
                      incredible and the battery lasts a long time. Worth every
                      penny!"
                    </p>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <p className="text-lg font-semibold text-[#333333]">
                        Jane Smith
                      </p>
                      <p className="text-sm text-[#9A8C98]">5 days ago</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[#333333]">
                      "I am really impressed with the Bluetooth speaker's
                      performance. It connects quickly and the sound quality is
                      crystal clear. Highly recommend!"
                    </p>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <p className="text-lg font-semibold text-[#333333]">
                        Michael Johnson
                      </p>
                      <p className="text-sm text-[#9A8C98]">1 week ago</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[#333333]">
                      "Good sound, but I expected a bit more bass. Overall, a
                      decent speaker for the price."
                    </p>
                  </div>
                </div>

                {/* Add Review Button */}
                <div className="text-center mt-8">
                  <button className="bg-[#D9BF77] hover:bg-[#C1A765] text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                    Add a Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quantity Modal */}
      {showQuantityModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl font-semibold mb-4">Enter Quantity</h2>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="border border-gray-300 p-2 w-full mb-4"
              />
              <div className="flex justify-between">
                <button onClick={() => setShowQuantityModal(false)} className="bg-red-600 text-white py-2 px-4 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleSubmitQuantity} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductDetail;
