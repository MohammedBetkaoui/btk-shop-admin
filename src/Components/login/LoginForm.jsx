import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';  // Importation nommée
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Username:", username);  // Vérifier les valeurs
    console.log("Password:", password);
  
    try {
      const response = await axios.post('https://backend-btk-shop.onrender.com/login', {
        username,
        password,
      });
  
      if (response.data.success) {
        login(response.data.token); // Enregistre le token dans le contexte et le localStorage
        navigate('/addproduct'); // Redirige vers la page d'ajout de produit
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Identifiants invalides');
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginForm;
