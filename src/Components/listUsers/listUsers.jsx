import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './listUsers.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="list-user-container">
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
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td className="user-id">{user._id}</td>
            <td>{user.username}</td>
            <td className="email-cell">{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListUser;