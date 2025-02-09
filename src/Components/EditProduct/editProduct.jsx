import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './editProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        description: '',
        image: '',
        sizes: []
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
              const response = await axios.get(`https://backend-btk-shop.onrender.com/products/${id}`);
              setProduct(response.data.product);
            } catch (error) {
                console.error('Error fetching product:', error);
                Swal.fire('Error', 'Failed to load product data', 'error');
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setProduct(prev => ({ ...prev, image: base64 }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.put(
              `https://backend-btk-shop.onrender.com/updateproduct/${id}`,
              product,
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                  }
              }
          );
          Swal.fire('Success!', 'Product updated successfully', 'success');
          navigate('/listproduct');
      } catch (error) {
          console.error('Error updating product:', error);
          Swal.fire('Error', error.response?.data?.message || 'Failed to update product', 'error');
      }
  };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="edit-product-container">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>New Price</label>
                    <input
                        type="number"
                        name="new_price"
                        value={product.new_price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Old Price</label>
                    <input
                        type="number"
                        name="old_price"
                        value={product.old_price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {product.image && (
                        <img src={product.image} alt="Preview" className="image-preview" />
                    )}
                </div>

                <button type="submit" className="update-button">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;