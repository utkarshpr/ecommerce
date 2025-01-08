import "./App.css";
import AuthProvider from "./components/AuthContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RoutesComponent from "./components/Routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar />
          <RoutesComponent />
          <Footer/>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
