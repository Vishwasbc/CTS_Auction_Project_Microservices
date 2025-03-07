// src/components/bid/PlaceBidPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import auctionService from '../../services/auctionService';
import productService from '../../services/productService';
import bidService from '../../services/bidService';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const PlaceBidPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const [auction, setAuction] = useState(null);
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionRes = await auctionService.getAuctionById(auctionId);
        setAuction(auctionRes.data);
        const productRes = await productService.getProductById(auctionRes.data.productId);
        setProduct(productRes.data);
      } catch (err) {
        setError('Failed to load auction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auctionId]);

  const calculatedMinBid =
    auction && product
      ? auction.currentHighestBid === 0
        ? product.price + auction.minBidAmount
        : auction.currentHighestBid + auction.minBidAmount
      : 0;

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setBidError(null);
    setBidSuccess(null);

    if (!auction) {
      setBidError('Auction data not available.');
      setBidLoading(false);
      return;
    }

    if (isNaN(parseFloat(bidAmount)) || parseFloat(bidAmount) < calculatedMinBid) {
      setBidError(`Bid amount must be a valid number and at least $${calculatedMinBid.toFixed(2)}`);
      setBidLoading(false);
      return;
    }

    // Correctly generate bidTime in "YYYY-MM-DDTHH:MM:SS" format with local time
    const bidTime = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }).replace(' ', 'T');

    const bidderName = authData?.user?.sub || 'Unknown';

    const bid = {
      bidderName,
      auctionId: auction.auctionId,
      bidAmount: parseFloat(bidAmount),
      bidTime,
    };

    try {
      await bidService.placeBid(bid);
      setBidSuccess('Your bid has been placed successfully!');
      setBidAmount('');
      const updatedAuction = await auctionService.getAuctionById(auctionId);
      setAuction(updatedAuction.data);
    } catch (err) {
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" size="3x" />
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </Alert>
        <Button variant="secondary" onClick={() => navigate('/auctions')}>
          Back to Auctions
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/auctions')}>
        Back to Auctions
      </Button>
      <h2 className="mb-4 text-center">Place Your Bid</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Auction #{auction.auctionId}</Card.Title>
          <Card.Text>
            <strong>Status:</strong> {auction.status}
          </Card.Text>
          <Card.Text>
            <strong>Current Highest Bid:</strong> ${auction.currentHighestBid.toFixed(2)}
          </Card.Text>
          <Card.Text>
            <strong>Minimum Bid Increment:</strong> ${auction.minBidAmount.toFixed(2)}
          </Card.Text>
          {product && (
            <>
              <hr />
              <h5>Product Details</h5>
              <Card>
                {product.imageUrl && (
                  <Card.Img variant="top" src={product.imageUrl} alt={product.productName} />
                )}
                <Card.Body>
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {product.productDescription || 'No description available.'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          )}
        </Card.Body>
      </Card>

      {auction.status === 'LIVE' ? (
        <>
          {bidError && <Alert variant="danger">{bidError}</Alert>}
          {bidSuccess && <Alert variant="success">{bidSuccess}</Alert>}
          <Form onSubmit={handleBidSubmit}>
            <Form.Group controlId="bidAmount" className="mb-3">
              <Form.Label>Bid Amount (USD)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min={calculatedMinBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Minimum Bid: ${calculatedMinBid.toFixed(2)}
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={bidLoading}>
              {bidLoading ? <Spinner animation="border" size="sm" /> : 'Place Bid'}
            </Button>
          </Form>
        </>
      ) : (
        <Alert variant="info">This auction is not live. You cannot place a bid at this time.</Alert>
      )}
    </Container>
  );
};

export default PlaceBidPage;
