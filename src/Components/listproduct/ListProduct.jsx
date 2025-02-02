import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './listProduct.css';

const ListProduct = () => {
  const [products, setProducts] = useState([]);

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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('https://backend-btk-shop.onrender.com/removeproduct', { id });
          setProducts(products.filter(product => product.id !== id));
          Swal.fire(
            'Deleted!',
            'Your product has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire(
            'Error!',
            'There was an issue deleting the product.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="list-product-container">
      <h2>List of Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>New Price:</strong> ${product.new_price}</p>
              <p><strong>Old Price:</strong> ${product.old_price}</p>
            </div>
            <button className="delete-button" onClick={() => handleDelete(product.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
