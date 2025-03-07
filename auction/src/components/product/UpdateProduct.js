// src/components/product/UpdateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import { Alert, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the existing product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productService.getProductById(productId);
        // Convert status to uppercase if necessary
        data.status = data.status.toUpperCase();
        setProductData(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
      }
    };

    fetchProduct();
  }, [productId]);

  // Update state upon input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.updateProduct(productId, productData);
      alert('Product updated successfully!');
      navigate('/products');
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please try again.');
    }
  };

  // Cancel and navigate back
  const handleCancel = () => {
    navigate('/products');
  };

  if (!productData) {
    return (
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Update Product</h2>
      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="border p-4 shadow-sm bg-light">
        {/* Product Name */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Product Name</Form.Label>
          <Form.Control
            type="text"
            name="productName"
            value={productData.productName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {/* Product Description */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Product Description</Form.Label>
          <Form.Control
            as="textarea"
            name="productDescription"
            value={productData.productDescription}
            onChange={handleChange}
            rows={4}
            required
          />
        </Form.Group>
        {/* Price */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            step="0.01"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {/* Status */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Status</Form.Label>
          <Form.Select
            name="status"
            value={productData.status}
            onChange={handleChange}
            required
          >
            {['PENDING', 'ACTIVE', 'SOLD'].map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/* Seller Name (Read Only) */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Seller Name</Form.Label>
          <Form.Control type="text" value={productData.sellerName} readOnly />
        </Form.Group>
        {/* Buttons */}
        <div className="d-flex justify-content-center">
          <Button type="submit" variant="success" className="me-3">
            Update Product
          </Button>
          <Button type="button" variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateProduct;
