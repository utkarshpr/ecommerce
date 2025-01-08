import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back to Top Section */}
        <div className="flex justify-center mb-8">
          <button
            onClick={scrollToTop}
            className="text-blue-400 hover:text-blue-600 transition duration-300 text-lg font-semibold"
          >
            &#8593; Back to Top
          </button>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mt-10">
          {/* Get to Know Us */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Get to Know Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  About My-app
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Press Releases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  My-app Science
                </a>
              </li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Connect with Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Make Money with Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Sell on My-app
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Sell under My-app Accelerator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Protect and Build Your Brand
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  My-app Global Selling
                </a>
              </li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Let Us Help You</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Your Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Returns Centre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Recalls and Product Safety Alerts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  100% Purchase Protection
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-12">
          {/* Websites */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">My-app Websites</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  English India
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  AbeBooks
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  My-app Web Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Audible
                </a>
              </li>
            </ul>
          </div>

          {/* Entertainment */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Entertainment</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  IMDb
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Shopbop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Prime Now
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  My-app Prime Music
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Policies</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Conditions of Use & Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Privacy Notice
                </a>
              </li>
            </ul>
          </div>

          {/* More to Explore */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">More to Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Sell on My-app
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Fulfilment by My-app
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Advertise Your Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  My-app Pay on Merchants
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>&copy; 2025 My-app. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
