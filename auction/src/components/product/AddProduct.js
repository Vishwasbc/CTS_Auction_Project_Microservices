import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    status: 'PENDING',
  });

  // Retrieve sellerName from authData
  const sellerName = authData?.user?.sub || 'Unknown Seller';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...productData,
        price: parseFloat(productData.price),
        sellerName,
      };
      await productService.addProduct(dataToSend);
      alert('Product added successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  if (!authData || !authData.user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow-sm bg-light">
        {/* Product Name */}
        <div className="mb-3">
          <label className="form-label fw-bold">Product Name</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            value={productData.productName}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            autoComplete="off"
          />
        </div>

        {/* Product Description */}
        <div className="mb-3">
          <label className="form-label fw-bold">Product Description</label>
          <textarea
            name="productDescription"
            className="form-control"
            value={productData.productDescription}
            onChange={handleChange}
            required
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label fw-bold">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            step="0.01"
            value={productData.price}
            onChange={handleChange}
            required
            placeholder="Enter price in USD"
            autoComplete="off"
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label fw-bold">Status</label>
          <select
            name="status"
            className="form-select"
            value={productData.status}
            onChange={handleChange}
            required
            disabled
          >
            {['PENDING', 'ACTIVE', 'SOLD'].map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Seller Name Display */}
        <div className="mb-3">
          <label className="form-label fw-bold">Seller Name</label>
          <input
            type="text"
            className="form-control"
            value={sellerName}
            disabled
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
