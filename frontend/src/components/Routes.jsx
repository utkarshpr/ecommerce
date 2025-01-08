import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Logout from './Logout';

import Alerts from '../Fragments/Alert';
import Product from './Product';
import ProfilePage from '../Fragments/ProfilePage';
import Notifications from '../Fragments/Notification';

const RoutesComponent = () => {
  return (
    
      <div className="container mx-auto mt-10">
        <Routes> 
        <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/product/:id" element={<Product/>}/>
          <Route path="/profile/:id" element={<ProfilePage />} />
<Route path="/notifications" element={<Notifications />} />
          {/* <Route path="/alert" element={<Alerts severity="error" message="Something went wrong." />}/> */}
        </Routes>
      </div>
   
  );
};

export default RoutesComponent;
