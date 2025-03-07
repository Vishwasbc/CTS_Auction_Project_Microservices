// src/components/bid/BidPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auctionService from '../services/auctionService';
import productService from '../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BidPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch auctions and append product name for each auction.
  useEffect(() => {
    const fetchAuctions = async () => {
      const startTime = Date.now(); // Record the start time before fetching
      try {
        const response = await auctionService.getAllAuctions();
        // Filter auctions with status LIVE or ENDED.
        const bidAuctions = response.data.filter(
          (auction) =>
            auction.status === 'LIVE' ||
            auction.status === 'ENDED'
        );
        const auctionsWithProduct = await Promise.all(
          bidAuctions.map(async (auction) => {
            try {
              const prodResponse = await productService.getProductById(auction.productId);
              return { ...auction, productName: prodResponse.data.productName };
            } catch (err) {
              return { ...auction, productName: 'Unknown Product' };
            }
          })
        );
        setAuctions(auctionsWithProduct);
      } catch (err) {
        console.error(err);
        setError('Failed to load auctions. Please try again later.');
      } finally {
        const elapsed = Date.now() - startTime;
        const minDelay = 1000; // Minimum delay of 1.0 seconds (1000 ms)
        if (elapsed < minDelay) {
          setTimeout(() => {
            setLoading(false);
          }, minDelay - elapsed);
        } else {
          setLoading(false);
        }
      }
    };

    fetchAuctions();
  }, []);

  // Update the filter status.
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Filter auctions based on the selected status.
  const filteredAuctions = auctions.filter((auction) => {
    return selectedStatus === 'ALL' ? true : auction.status === selectedStatus;
  });

  // Render an individual auction card.
  const renderAuctionCard = (auction, index) => (
    <div key={auction.auctionId} className="col-md-6 col-lg-4 mb-4">
      <div className={`card h-100 shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-light'}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Auction #{auction.auctionId}</h5>
          <p className="card-text mb-1">
            <strong>Product:</strong> {auction.productName}
          </p>
          <p className="card-text mb-1">
            <strong>Current Highest Bid:</strong> ${auction.currentHighestBid.toFixed(2)}
          </p>
          <p className="card-text mb-1">
            <strong>Status:</strong>{' '}
            <span
              className={`badge ${
                auction.status === 'LIVE'
                  ? 'bg-success'
                  : auction.status === 'ENDED'
                  ? 'bg-secondary'
                  : 'bg-primary'
              }`}
            >
              {auction.status}
            </span>
          </p>
          <button
            className="btn btn-outline-primary w-100 rounded-pill"
            onClick={() => navigate(`/bids/${auction.auctionId}`)}
          >
            <FontAwesomeIcon icon={faGavel} className="me-2" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // Use our LoadingSpinner component when loading is true.
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  // Error state.
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5 bg-light min-vh-100">
      <div className="container pt-5">
        <h2 className="mb-4 text-center">Bid Auctions Overview</h2>
        <div className="d-flex flex-wrap align-items-center mb-4 justify-content-center">
          <div className="btn-group" role="group">
            {['ALL', 'LIVE', 'ENDED'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn btn-${selectedStatus === status ? 'primary' : 'outline-primary'} me-2 mb-2 rounded-pill`}
                onClick={() => handleStatusChange(status)}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {filteredAuctions.length > 0 ? (
          <div className="row">
            {filteredAuctions.map((auction, index) => renderAuctionCard(auction, index))}
          </div>
        ) : (
          <div className="alert alert-info">
            No auctions available for bidding.
          </div>
        )}
      </div>
    </div>
  );
};

export default BidPage;
