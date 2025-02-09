import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './listOrders.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/order', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Tri des commandes par date décroissante
        const sortedOrders = [...response.data.orders].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://backend-btk-shop.onrender.com/order/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Mettre à jour l'état local des commandes
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Échec de la mise à jour:', error);
    }
  };

  const handleConfirmOrder = (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir confirmer cette commande ?')) {
      updateStatus(orderId, 'confirmed');
    }
  };

  const handleDeliverOrder = (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette commande comme livrée ?')) {
      updateStatus(orderId, 'delivered');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="main-title">Historique des Commandes</h1>

      <div className="orders-grid">
        {orders.map((order) => (
          <article key={order._id} className="order-card">
            <header className="order-header">
              <h2 className="order-id">Commande #{order._id.slice(-6).toUpperCase()}</h2>
              <div className="user-info">
                <h3>Client</h3>
                <p className="user-name">{order.userId.username}</p>
                <p className="user-email">{order.userId.email}</p>
              </div>
            </header>

            <div className="order-details">
              <div className="meta-info">
                <p className="order-date">
                  {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                </p>
                <p className="total-amount">
                  Total : {order.totalAmount.toFixed(2)} 
                </p>
              </div>

              <div className="order-actions">
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="confirm-button"
                  >
                    Confirmer
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleDeliverOrder(order._id)}
                    className="deliver-button"
                  >
                    Commande livrée
                  </button>
                )}
                {order.status === 'delivered' && (
                  <div className="final-status">
                    <p>Commande livrée (pas de routeur)</p>
                    <p>Routeur</p>
                  </div>
                )}
              </div>

              <div className="products-list">
                <h4>Produits ({order.products.length})</h4>
                {order.products.map((product, index) => (
                  <div key={index} className="product-item">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h5 className="product-name">{product.name}</h5>
                      <div className="product-details">
                        <span>Prix unitaire : {product.price.toFixed(2)} </span>
                        <span>Quantité : {product.quantity}</span>
                        <span>Taille : {product.size}</span>
                      </div>
                    </div>
                    <div className="product-total">
                      {(product.price * product.quantity).toFixed(2)} 
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ListOrders;