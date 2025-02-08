import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './listUsers.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserCart, setSelectedUserCart] = useState(null); // Correction ici
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false); // État pour le chargement du panier

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/users',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserCart = async (userId) => { // Correction ici
    setIsCartLoading(true); // Activer le chargement du panier
    try {
      const response = await axios.get(
        `https://backend-btk-shop.onrender.com/admin/users/cart/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSelectedUserCart(response.data.cart); // Correction ici
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsCartLoading(false); // Désactiver le chargement du panier
    }
  };

  const handleOpenCartModal = (userId) => {
    setIsCartLoading(true); // Activer le chargement avant d'ouvrir le modal
    fetchUserCart(userId); // Récupérer le panier de l'utilisateur
    setIsCartModalOpen(true); // Ouvrir le modal
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="list-user-container">
      {/* Modal Panier */}
      {isCartModalOpen && (
        <div className={`cart-modal ${isCartModalOpen ? 'open' : ''}`}>
        <div className="modal-content">
            <h3>Détails du Panier</h3>
            {isCartLoading && (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Chargement du panier...</p>
  </div>
 )}
 {selectedUserCart?.length > 0 ? (
  <>
    {selectedUserCart.map(item => (
      <div key={`${item.productId}-${item.size}`} className="cart-item">
        <img src={item.image} alt={item.name} className="cart-item-image" />
        <div className="cart-item-info">
          <h4 className="item-name">{item.name}</h4>
          <div className="item-details">
            <div className="detail-row">
              <span>Taille :</span>
              <strong>{item.size}</strong>
            </div>
            <div className="detail-row">
              <span>Quantité :</span>
              <strong>{item.quantity}</strong>
            </div>
            <div className="detail-row">
              <span>Prix unitaire :</span>
              <strong>{item.price.toFixed(2)}</strong>
            </div>
            <div className="detail-row total-row">
              <span>Total article :</span>
              <strong>{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    ))}
    <div className="cart-total">
      <h3>Total du panier : 
        <span>
          {selectedUserCart
            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
            .toFixed(2)}
        </span>
      </h3>
    </div>
  </>
) : (
  <p>Le panier est vide.</p>
)}
            <button  onClick={() => setIsCartModalOpen(false)}>Fermer</button>
          </div>
        </div>
      )}

      <h1>Liste des Utilisateurs</h1>

      {/* Version Desktop */}
      <div className="table-container desktop-view">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Articles en Panier</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} onClick={() => handleOpenCartModal(user._id)}>
                <td className="user-id">{user._id}</td>
                <td>{user.username}</td>
                <td className="email-cell">{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.cart.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Mobile */}
      <div className="mobile-view">
        {users.map((user) => (
          <div key={user._id} className="user-card" onClick={() => handleOpenCartModal(user._id)}>
            <div className="card-header">
              <span className="username">{user.username}</span>
              
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Date d'inscription:</span>
              <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Articles en Panier:</span>
              <span className="value">{user.cart.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListUser;