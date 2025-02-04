import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './listProduct.css';

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backend-btk-shop.onrender.com/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.post('https://backend-btk-shop.onrender.com/removeproduct', { id }, {
         
        });
        setProducts(products.filter(product => product.id !== id));
        Swal.fire('Deleted!', 'The product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'Failed to delete the product.', 'error');
      }
    }
  };

  return (
    <div className="list-product-container">
      <h2>List of Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              onClick={() => setSelectedImage(product.image)}
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>New Price:</strong> {product.new_price}</p>
              <p><strong>Old Price:</strong> {product.old_price}</p>
            </div>
            <button className="delete-button" onClick={() => handleDelete(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox active" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Product" />
          <button className="close-lightbox" onClick={() => setSelectedImage(null)}>X</button>
        </div>
      )}
    </div>
  );
};

export default ListProduct;