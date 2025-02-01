import React, { useState } from 'react';
import axios from 'axios';
import './addproduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    new_price: '',
    old_price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('new_price', product.new_price);
    formData.append('old_price', product.old_price);
    formData.append('image', product.image);

    try {
      const response = await axios.post('https://backend-btk-shop.onrender.com/addproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added successfully!');
      setProduct({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        image: null,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={product.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>New Price</label>
          <input type="number" name="new_price" value={product.new_price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Old Price</label>
          <input type="number" name="old_price" value={product.old_price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" name="image" onChange={handleImageChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;