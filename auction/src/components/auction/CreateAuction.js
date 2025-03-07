import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import auctionService from '../../services/auctionService';
import productService from '../../services/productService';

const CreateAuction = () => {
  const [auctionData, setAuctionData] = useState({
    productId: '',
    startDate: '',
    endDate: '',
    startPrice: '',
    currentHighestBid: '0',
    minBidAmount: '',
  });
  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [minStartDate, setMinStartDate] = useState('');

  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Format current date to a datetime-local string (YYYY-MM-DDTHH:MM)
  useEffect(() => {
    setMinStartDate(new Date().toISOString().slice(0, 16));

    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const pendingProducts = response.data.filter(
          (product) => product.status === 'PENDING'
        );
        setProducts(pendingProducts);

        const prices = {};
        pendingProducts.forEach((product) => {
          prices[product.productId] = product.price;
        });
        setProductPrices(prices);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productId') {
      const selectedPrice = productPrices[value] || '';
      setAuctionData((prevData) => ({
        ...prevData,
        productId: value,
        startPrice: selectedPrice,
      }));
    } else {
      setAuctionData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCancel = () => {
    navigate('/auctions');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!auctionData.startDate || !auctionData.endDate) {
      setError('Both start and end dates are required.');
      setLoading(false);
      return;
    }
    if (new Date(auctionData.endDate) <= new Date(auctionData.startDate)) {
      setError('End date must be after start date.');
      setLoading(false);
      return;
    }
    if (!auctionData.productId) {
      setError('Please select a product.');
      setLoading(false);
      return;
    }
    if (!auctionData.minBidAmount || parseFloat(auctionData.minBidAmount) <= 0) {
      setError('Minimum Bid Increment must be greater than 0.');
      setLoading(false);
      return;
    }

    // Append seconds to date strings
    const startDateLocal = auctionData.startDate + ':00';
    const endDateLocal = auctionData.endDate + ':00';

    const dataToSubmit = {
      productId: Number(auctionData.productId),
      startDate: startDateLocal,
      endDate: endDateLocal,
      startPrice: parseFloat(auctionData.startPrice),
      currentHighestBid: 0,
      minBidAmount: parseFloat(auctionData.minBidAmount),
      status: 'UPCOMING',
    };

    try {
      await auctionService.createAuction(dataToSubmit);
      navigate('/auctions');
    } catch (err) {
      setError('Failed to create auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!authData?.user?.roles.includes('ADMIN')) {
    return (
      <div className="container mt-5">
        <Alert variant="info">
          You are not authorized to create auctions. Please contact your administrator.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Create Auction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
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

        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>Start Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startDate"
            value={auctionData.startDate}
            onChange={handleChange}
            min={minStartDate}
            required
          />
        </Form.Group>

        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>End Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endDate"
            value={auctionData.endDate}
            onChange={handleChange}
            min={auctionData.startDate || minStartDate}
            required
          />
        </Form.Group>

        <Form.Group controlId="startPrice" className="mb-3">
          <Form.Label>Start Price (USD)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="startPrice"
            value={auctionData.startPrice}
            readOnly
            required
          />
        </Form.Group>

        <Form.Group controlId="currentHighestBid" className="mb-3">
          <Form.Label>Current Highest Bid (USD)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="currentHighestBid"
            value={auctionData.currentHighestBid}
            readOnly
            required
          />
        </Form.Group>

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

        <Button variant="success" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creating...
            </>
          ) : (
            'Create Auction'
          )}
        </Button>{' '}
        <Button variant="danger" onClick={handleCancel}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default CreateAuction;
