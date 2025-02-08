import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaSignOutAlt, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          {isMobile && (
            <button className="close-button" onClick={toggleMenu}>
              <FaTimes />
            </button>
          )}
        </div>
        
        <ul className="menu-items">
          <li>
            <Link to="/addproduct" className="menu-link">
              <FaPlus className="icons" />
              <span>Add Product</span>
            </Link>
          </li>
          <li>
            <Link to="/listproduct" className="menu-link">
              <FaList className="icons" />
              <span>List Product</span>
            </Link>
          </li>
          <li>
            <Link to="/listUsers" className="menu-link">
              <FaList className="icons" />
              <span>List Users</span>
            </Link>
          </li>
          <li>
            <Link to="/listOrders" className="menu-link">
              <FaShoppingCart className="icons" />
              <span>List Orders</span>
            </Link>
          </li>
          
          {isAuthenticated && (
            <li>
              <button onClick={handleLogout} className="menu-link logout-button">
                <FaSignOutAlt className="icons" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {isMobile && (
        <>
          <button className={`toggle-button ${isOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
            ☰
          </button>
          {isOpen && <div className="sidebar-overlay" onClick={toggleMenu} />}
        </>
      )}
    </>
  );
};

export default Sidebar;