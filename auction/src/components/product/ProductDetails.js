// src/components/product/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import { Card, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const { productId } = useParams();
  const productIdInt = parseInt(productId, 10);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(productIdInt);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productIdInt]);

  const handleBackClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Product not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Button variant="outline-secondary" onClick={handleBackClick} className="mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to Products
      </Button>
      <Card>
        <Card.Body>
          <Card.Title>{product.productName}</Card.Title>
          <Card.Text>
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </Card.Text>
          <Card.Text>
            <strong>Status:</strong> {product.status}
          </Card.Text>
          <Card.Text>
            <strong>Description:</strong>{' '}
            {product.productDescription || 'No description available.'}
          </Card.Text>
          <Card.Text>
            <strong>Seller:</strong>{' '}
            {product.sellerName || 'Seller information not available.'}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetail;
