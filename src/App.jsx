import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/sidebar/sidebar';
import Addproduct from './Components/addProduct/AddProduct';
import ListProduct from './Components/listproduct/ListProduct';
import LoginForm from './Components/login/LoginForm';
import './index.css';


const App = () => {
  return (
    
      <div className="app-container">
        <Sidebar/>
        <div className="content">
          <Routes>
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/listproduct" element={<ListProduct />} />
            <Route path="/" element={<LoginForm />} /> 
          </Routes>
        </div>
      </div>
    
  );
};

export default App;