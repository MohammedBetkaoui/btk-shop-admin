import React, { useState, useRef } from 'react';
import axios from 'axios';
import './addproduct.css';

const Addproduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '', // La catégorie est maintenant une chaîne de caractères
    new_price: '',
    old_price: '',
    image: null,
    description: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Référence pour l'élément input de type file
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Gestionnaire de clic pour la div file-upload
  const handleFileUploadClick = () => {
    fileInputRef.current.click(); // Déclenche le clic sur l'input file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('new_price', product.new_price);
    formData.append('old_price', product.old_price);
    formData.append('image', product.image);
    formData.append('description', product.description);

    try {
      await axios.post('https://backend-btk-shop.onrender.com/addproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setAlert({ message: 'Product added successfully!', type: 'success' });

      setProduct({
        name: '',
        category: '', // Réinitialiser la catégorie
        new_price: '',
        old_price: '',
        image: null,
        description: '',
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding product:', error);
      setAlert({ message: 'Error adding product!', type: 'error' });
    }

    setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="add-product-container">
      {alert.message && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h2>Product Addition Form</h2>
      <p>Please fill out the form to add a new product to your store.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Title <span className="span">*</span></label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Category <span className="span">*</span></label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="form-group">
          <label>Old Price <span className="span">*</span></label>
          <input type="number" name="old_price" value={product.old_price} onChange={handleChange} placeholder="e.g., 23" required />
        </div>

        <div className="form-group">
          <label>New Price <span className="span">*</span></label>
          <input type="number" name="new_price" value={product.new_price} onChange={handleChange} placeholder="e.g., 23" required />
        </div>

        <div className="form-group">
          <label>Description <span className="span">*</span></label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter product description"
          />
        </div>

        <div className="form-group">
          <label>Upload Product Image <span className="span">*</span></label>
          <div className="file-upload" onClick={handleFileUploadClick}>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
              required
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <span>Upload a File</span>
                <p>Drag and drop files here</p>
              </>
            )}
          </div>
        </div>

        <button className='btn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Addproduct;