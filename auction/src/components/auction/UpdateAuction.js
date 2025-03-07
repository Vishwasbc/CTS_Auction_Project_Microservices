import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import auctionService from '../../services/auctionService';
import productService from '../../services/productService';
import { AuthContext } from '../../context/AuthContext';
import { Alert, Form, Button, Spinner } from 'react-bootstrap';

const UpdateAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const [auctionData, setAuctionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Determine if the user is an admin
  const userRoles = Array.isArray(authData?.user?.roles)
    ? authData.user.roles
    : [authData?.user?.roles];
  const isAdmin = userRoles.includes('ADMIN') || userRoles.includes('ROLE_ADMIN');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auctions');
      return;
    }

    const fetchAuction = async () => {
      try {
        const { data } = await auctionService.getAuctionById(auctionId);
        setAuctionData(data);
      } catch (err) {
        setError('Failed to load auction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAuction();
    fetchProducts();
  }, [auctionId, isAdmin, navigate]);

  const handleChange = (e) => {
    setAuctionData({ ...auctionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);

    if (new Date(auctionData.endDate) <= new Date(auctionData.startDate)) {
      setUpdateError('End date must be after start date.');
      setUpdateLoading(false);
      return;
    }

    try {
      await auctionService.updateAuction(auctionId, auctionData);
      navigate('/auctions');
    } catch (err) {
      setUpdateError('Failed to update auction. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading || loadingProducts) {
    return (
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error || !auctionData) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Update Auction</h2>
      {updateError && <Alert variant="danger">{updateError}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Product Selection */}
        <Form.Group controlId="productId" className="mb-3">
          <Form.Label>Product</Form.Label>
          <Form.Select
            name="productId"
            value={auctionData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productName} (ID: {product.productId})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Start Date and Time */}
        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>Start Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startDate"
            value={auctionData.startDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* End Date and Time */}
        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>End Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endDate"
            value={auctionData.endDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Start Price */}
        <Form.Group controlId="startPrice" className="mb-3">
          <Form.Label>Start Price (USD)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="startPrice"
            value={auctionData.startPrice}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Minimum Bid Increment */}
        <Form.Group controlId="minBidAmount" className="mb-3">
          <Form.Label>Minimum Bid Increment (USD)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="minBidAmount"
            value={auctionData.minBidAmount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Auction Status */}
        <Form.Group controlId="status" className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={auctionData.status}
            onChange={handleChange}
            required
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="ENDED">Ended</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={updateLoading}>
          {updateLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Updating...
            </>
          ) : (
            'Update Auction'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateAuction;
