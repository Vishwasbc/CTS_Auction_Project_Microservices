// src/components/bids/AuctionBidsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import bidService from '../../services/bidService';
import auctionService from '../../services/auctionService';
import productService from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const AuctionBidsPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();

  // State for bids
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState(null);

  // State for auction and product details
  const [auction, setAuction] = useState(null);
  const [product, setProduct] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoError, setInfoError] = useState(null);

  // State for highest bidder details
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidLoading, setHighestBidLoading] = useState(true);
  const [highestBidError, setHighestBidError] = useState(null);

  // Helper to format numbers
  const formatNumber = (num) =>
    typeof num === 'number' ? num.toFixed(2) : '0.00';

  // Fetch bids for the auction
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data } = await bidService.getBidsByAuction(auctionId);
        setBids(data);
      } catch (err) {
        console.error(err);
        setBidsError('Failed to load bids. Please try again later.');
      } finally {
        setBidsLoading(false);
      }
    };
    fetchBids();
  }, [auctionId]);

  // Fetch auction and associated product information
  useEffect(() => {
    const fetchAuctionInfo = async () => {
      try {
        const { data: auctionData } = await auctionService.getAuctionById(auctionId);
        setAuction(auctionData);
        const { data: productData } = await productService.getProductById(auctionData.productId);
        setProduct(productData);
      } catch (err) {
        console.error(err);
        setInfoError('Failed to load auction info. Please try again later.');
      } finally {
        setInfoLoading(false);
      }
    };
    fetchAuctionInfo();
  }, [auctionId]);

  // Fetch the highest bidder details using getHighestBidder endpoint
  useEffect(() => {
    if (auction) {
      const fetchHighestBidder = async () => {
        try {
          const { data } = await bidService.getHighestBidder(auctionId);
          console.log('Highest Bidder Response:', data); // Debug log
          // Adjust mapping if your API returns nested data; currently, if there's no "highestBidder" key, fallback to the response directly.
          setHighestBid(data.highestBidder || data);
        } catch (err) {
          console.error(err);
          setHighestBidError('Failed to load highest bidder details.');
        } finally {
          setHighestBidLoading(false);
        }
      };
      fetchHighestBidder();
    } else {
      setHighestBidLoading(false);
    }
  }, [auction, auctionId]);

  return (
    <Container className="mt-5">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to Auctions
      </Button>
      <h2 className="mb-4 text-center">Bids for Auction #{auctionId}</h2>

      {/* Auction & Product Info */}
      {infoLoading ? (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : infoError ? (
        <Alert variant="danger" className="d-flex align-items-center mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {infoError}
        </Alert>
      ) : auction ? (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Auction #{auction.auctionId}</Card.Title>
            <Card.Text>
              <strong>Status:</strong> {auction.status}
            </Card.Text>
            <Card.Text>
              <strong>Current Highest Bid:</strong> ${formatNumber(auction.currentHighestBid)}
            </Card.Text>
            <Card.Text>
              <strong>Minimum Bid Increment:</strong> ${formatNumber(auction.minBidAmount)}
            </Card.Text>
            {product && (
              <>
                <hr />
                <h5>Product Details</h5>
                <Card className="mb-3">
                  {product.imageUrl && (
                    <Card.Img variant="top" src={product.imageUrl} alt={product.productName} />
                  )}
                  <Card.Body>
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text>
                      <strong>Description:</strong>{' '}
                      {product.productDescription || 'No description available.'}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${formatNumber(product.price)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </>
            )}
          </Card.Body>
        </Card>
      ) : null}

      {/* Highest Bidder Details */}
      <h4 className="mb-3 text-center">Highest Bidder Details</h4>
      {highestBidLoading ? (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : highestBidError ? (
        <Alert variant="danger" className="d-flex align-items-center mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {highestBidError}
        </Alert>
      ) : highestBid ? (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Highest Bidder Details</Card.Title>
            <Card.Text>
              <strong>Bidder:</strong> {highestBid.bidderName}
            </Card.Text>
            <Card.Text>
              <strong>Bid Amount:</strong> ${formatNumber(highestBid.bidAmount)}
            </Card.Text>
            <Card.Text>
              <strong>Bid Time:</strong> {highestBid.bidTime}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info" className="mb-4">
          No highest bidder details available.
        </Alert>
      )}

      {/* Bids Table */}
      {bidsLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : bidsError ? (
        <Alert variant="danger" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {bidsError}
        </Alert>
      ) : bids.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Bidder Name</th>
              <th>Bid Amount (USD)</th>
              <th>Bid Time</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={bid.bidId || index}>
                <td>{index + 1}</td>
                <td>{bid.bidderName}</td>
                <td>${formatNumber(bid.bidAmount)}</td>
                <td>{bid.bidTime}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No bids have been placed yet.</Alert>
      )}
    </Container>
  );
};

export default AuctionBidsPage;
