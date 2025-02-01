import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './listProduct.css';

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.post('https://backend-btk-shop.onrender.com/removeproduct', { id });
      setProducts(products.filter(product => product.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div className="list-product-container">
      <h2>List of Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Affichage de l'image */}
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              onClick={() => setLightboxImage(product.image)}
            />
            {/* Métadonnées de l'image */}
            <div className="image-details">
              <p><strong>Filename:</strong> {product.image.split('/').pop()}</p>
              <p><strong>Format:</strong> {product.image.split('.').pop().toUpperCase()}</p>
            </div>

            {/* Détails du produit */}
            <div className="product-details">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>New Price:</strong> ${product.new_price}</p>
              <p><strong>Old Price:</strong> ${product.old_price}</p>
            </div>

            {/* Bouton supprimer */}
            <button className="delete-button" onClick={() => handleDelete(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox pour afficher l'image en grand */}
      {lightboxImage && (
        <div className="lightbox active" onClick={() => setLightboxImage(null)}>
          <span className="close-lightbox">&times;</span>
          <img src={lightboxImage} alt="Full View" />
        </div>
      )}
    </div>
  );
};

export default ListProduct;
