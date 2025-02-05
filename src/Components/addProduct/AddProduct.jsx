import React, { useState, useRef } from 'react';
import axios from 'axios';
import './addproduct.css';

const Addproduct = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    new_price: '',
    old_price: '',
    image: null,
    description: '',
    sizes: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setProduct(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Ajout des champs au FormData
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('new_price', product.new_price);
    formData.append('old_price', product.old_price);
    formData.append('image', product.image);
    formData.append('description', product.description);
    formData.append('sizes', JSON.stringify(product.sizes));

    try {
      const response = await axios.post(
        'https://backend-btk-shop.onrender.com/addproduct', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setAlert({ 
        message: response.data.message || 'Produit ajouté avec succès !', 
        type: 'success' 
      });

      // Réinitialisation du formulaire
      setProduct({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        image: null,
        description: '',
        sizes: []
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit :', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout du produit !';
      setAlert({ 
        message: errorMessage, 
        type: 'error' 
      });
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

      <h2>Formulaire d'ajout de produit</h2>
      <p>Remplissez le formulaire pour ajouter un nouveau produit à votre boutique.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du produit <span className="span">*</span></label>
          <input 
            type="text" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Catégorie <span className="span">*</span></label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Choisir une catégorie</option>
            <option value="Men">Homme</option>
            <option value="Women">Femme</option>
            <option value="Kids">Enfant</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ancien prix <span className="span">*</span></label>
          <input 
            type="number" 
            name="old_price" 
            value={product.old_price} 
            onChange={handleChange} 
            placeholder="ex: 50" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Nouveau prix <span className="span">*</span></label>
          <input 
            type="number" 
            name="new_price" 
            value={product.new_price} 
            onChange={handleChange} 
            placeholder="ex: 35" 
            required 
          />
        </div>

        {/* Remplacez le select multiple par ce bloc */}
<div className="form-group">
  <label>Tailles disponibles</label>
  <div className="size-options">
    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
      <label key={size} className="size-checkbox">
        <input
          type="checkbox"
          name="sizes"
          value={size}
          checked={product.sizes.includes(size)}
          onChange={(e) => {
            const newSizes = e.target.checked
              ? [...product.sizes, size]
              : product.sizes.filter(s => s !== size);
            setProduct(prev => ({ ...prev, sizes: newSizes }));
          }}
        />
        <span>{size}</span>
      </label>
    ))}
  </div>
</div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description du produit (optionnelle)"
          />
        </div>

        <div className="form-group">
          <label>Image du produit <span className="span">*</span></label>
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
              <img src={imagePreview} alt="Aperçu" className="image-preview" />
            ) : (
              <>
                <span>Téléverser une image</span>
                <p>Glissez-déposez des fichiers ici</p>
              </>
            )}
          </div>
        </div>

        <button className='btn' type="submit">Ajouter le produit</button>
      </form>
    </div>
  );
};

export default Addproduct;