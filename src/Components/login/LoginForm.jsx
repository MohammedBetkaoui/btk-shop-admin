import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Stocke les erreurs
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Réinitialiser les erreurs avant validation

    let formErrors = {};

    // Vérification des champs vides
    if (!username.trim()) {
      formErrors.username = "Le nom d'utilisateur est requis.";
    }
    if (!password.trim()) {
      formErrors.password = "Le mot de passe est requis.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://backend-btk-shop.onrender.com/login', {
        username,
        password,
      });

      if (response.data.success) {
        login(response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/addproduct');
      } else {
        setErrors({ general: "Nom d'utilisateur ou mot de passe incorrect." });
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        {/* Affichage des erreurs générales (ex: mauvais identifiants) */}
        {errors.general && <p className="error-message">{errors.general}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="loader"></span> : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
