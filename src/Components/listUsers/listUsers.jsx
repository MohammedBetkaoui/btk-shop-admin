import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './listUsers.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://backend-btk-shop.onrender.com', {
      withCredentials: true,
      transports: ['websocket']
    });
    
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const fetchInitialUsers = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    socket.on('users-updated', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('connect_error', (err) => {
      setError('Erreur de connexion temps réel');
      console.error('Socket error:', err);
    });

    fetchInitialUsers();

    return () => {
      socket.off('users-updated');
      socket.off('connect_error');
    };
  }, [socket]);

  

  if (loading) return <div className="loading">Chargement...</div>;

  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="list-user-container">
      <h1>Gestion des Utilisateurs (Temps réel)</h1>
      
      {/* Version Desktop */}
      <table className="user-table desktop-view">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Inscription</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
             
            </tr>
          ))}
        </tbody>
      </table>

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
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ListUser;