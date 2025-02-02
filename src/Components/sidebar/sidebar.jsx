import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige vers la page de connexion après la déconnexion
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>{isOpen ? 'Admin Panel' : '☰'}</h2>
        <ul>
          <li>
            <Link to="/addproduct">
              <FaPlus className="icon" />
              {isOpen && <span>Add Product</span>}
            </Link>
          </li>
          <li>
            <Link to="/listproduct">
              <FaList className="icon" />
              {isOpen && <span>List Product</span>}
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt className="icon" />
                {isOpen && <span>Logout</span>}
              </button>
            </li>
          )}
        </ul>
      </div>
      {isMobile && (
        <button className="toggle-button" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
      )}
    </>
  );
};

export default Sidebar;