import React, { useState } from 'react';
import './navbar.css';
import navlogo from '../../assets/nav-logo.png';
import navProfile from '../../assets/1736384287357.jpeg';

const Navbar = () => {
  

 

  return (
    <div className='navbar'>
      {/* Logo */}
      <img src={navlogo} alt="Logo" className="nav-logo" />

      {/* Profil */}
      <img src={navProfile} alt="Profil" className='nav-profile' />
    </div>
  );
};

export default Navbar;