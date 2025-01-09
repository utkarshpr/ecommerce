import "./App.css";
import AuthProvider from "./components/AuthContext";
import { CartProvider } from "./components/CartContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RoutesComponent from "./components/Routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
      <AuthProvider>
        <CartProvider>
        <Router>
          <Navbar />
          <RoutesComponent />
          <Footer/>
        </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
