import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './listUsers.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserCart, setSelectedUserCart] = useState(null);
const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  // Fonction de récupération du panier
const fetchUserCart = async (userId) => {
  try {
    const response = await axios.get(
      `https://backend-btk-shop.onrender.com/admin/users/cart/${userId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setSelectedUserCart(response.data.cart);
    setIsCartModalOpen(true);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};

  return (
    
    <div className="list-user-container">
      {isCartModalOpen && (
  <div className="cart-modal">
    <div className="modal-content">
      <h3>Détails du Panier</h3>
      {selectedUserCart?.map(item => (
        <div key={item.productId} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <p>Taille: {item.size}</p>
            <p>Quantité: {item.quantity}</p>
            <p>Prix: {item.price}€</p>
          </div>
        </div>
      ))}
      <button onClick={() => setIsCartModalOpen(false)}>Fermer</button>
    </div>
  </div>
)}
      <h1>Liste des Utilisateurs</h1>
      
      {/* Version Desktop */}
      <div className="table-container">
    <table className="user-table desktop-view">
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
          <tr key={user._id}>
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
          <div className="user-card" key={user._id}>
            <div className="card-header">
              <span className="username">{user.username}</span>
              <span className="user-id">ID: {user._id}</span>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Inscription:</span>
                <span className="value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                   <span className="label">Articles en Panier:</span>
                   <span className="value">{user.cart.length}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListUser;