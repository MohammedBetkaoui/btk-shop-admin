import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // AuthProvider seul ici
import Sidebar from './Components/sidebar/sidebar';
import Addproduct from './Components/addProduct/AddProduct';
import ListProduct from './Components/listproduct/ListProduct';
import LoginForm from './Components/login/LoginForm';
import { useAuth } from './context/AuthContext'; // ou le chemin correct vers votre fichier de contexte

import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/addproduct"
              element={
                <PrivateRoute>
                  <Addproduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/listproduct"
              element={
                <PrivateRoute>
                  <ListProduct />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
