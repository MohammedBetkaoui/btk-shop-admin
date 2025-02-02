import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ID du produit récupéré depuis useParams:', id);
    axios.get(`https://backend-btk-shop.onrender.com/editproduct/${id}`)
      .then(response => {
        setProduct(response.data.product);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du produit :', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit non trouvé</p>;

  return (
    <div>
      <h1>Modifier le produit</h1>
      <p>Nom: {product.name}</p>
      <p>Description: {product.description}</p>
      <p>Prix: {product.price} €</p>
    </div>
  );
};

export default EditProduct;
