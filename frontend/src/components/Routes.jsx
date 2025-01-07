import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Logout from './Logout';

import Alerts from '../Fragments/Alert';

const RoutesComponent = () => {
  return (
    
      <div className="container mx-auto mt-10">
        <Routes> 
        <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout/>}/>
          {/* <Route path="/alert" element={<Alerts severity="error" message="Something went wrong." />}/> */}
        </Routes>
      </div>
   
  );
};

export default RoutesComponent;
