import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Logout from './Logout';

const RoutesComponent = () => {
  return (
    
      <div className="container mx-auto mt-10">
        <Routes> {/* Define Routes for Login and Signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
      </div>
   
  );
};

export default RoutesComponent;
