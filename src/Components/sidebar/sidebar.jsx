import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaList } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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