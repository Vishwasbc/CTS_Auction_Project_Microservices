// src/components/auction/AuctionPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import auctionService from '../services/auctionService';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faExclamationTriangle,
  faEdit,
  faGavel,
  faTrash,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Normalize user roles as an array.
  const userRolesRaw = authData?.user?.roles || [];
  const userRoles = Array.isArray(userRolesRaw) ? userRolesRaw : [userRolesRaw];

  const isAdmin = userRoles.includes('ADMIN');
  const isBidder = userRoles.includes('BIDDER');

  // Fetch auctions when the component mounts with a delay so the spinner is visible for at least 1.5 seconds.
  useEffect(() => {
    const fetchAuctions = async () => {
      const startTime = Date.now(); // Record start time
      try {
        const response = await auctionService.getAllAuctions();
        setAuctions(response.data);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
        setError('Failed to load auctions. Please try again later.');
      } finally {
        const elapsed = Date.now() - startTime;
        const minDelay = 1000; // 1.5 seconds minimum delay
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

  // Handle status filter changes.
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Filter auctions based on the selected status.
  const filteredAuctions = auctions.filter((auction) =>
    selectedStatus === 'ALL' ? true : auction.status === selectedStatus
  );

  // Navigation functions.
  const handleCreateAuctionClick = () => navigate('/create-auction');
  const handleUpdateAuctionClick = (auctionId) => navigate(`/update-auction/${auctionId}`);

  // End auction (for admin).
  const handleEndAuction = async (auctionId) => {
    if (!window.confirm('Are you sure you want to end this auction?')) return;
    try {
      await auctionService.endAuction(auctionId);
      // Update auction status locally.
      setAuctions((prev) =>
        prev.map((auction) =>
          auction.auctionId === auctionId ? { ...auction, status: 'ENDED' } : auction
        )
      );
    } catch (err) {
      console.error('Error ending auction:', err);
      alert('Failed to end auction. Please try again.');
    }
  };

  // Delete auction.
  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    try {
      await auctionService.deleteAuction(auctionId);
      setAuctions((prev) =>
        prev.filter((auction) => auction.auctionId !== auctionId)
      );
    } catch (err) {
      console.error('Error deleting auction:', err);
      alert('Failed to delete auction. Please try again.');
    }
  };

  // Render individual auction cards.
  const renderAuctionCard = (auction, index) => (
    <div key={auction.auctionId} className="col-md-6 col-lg-4 mb-4">
      <div className={`card h-100 shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-light'}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">Auction #{auction.auctionId}</h5>
          <p className="card-text mb-1">
            <strong>Product ID:</strong> {auction.productId}
          </p>
          <p className="card-text mb-1">
            <strong>Start Price:</strong> ${auction.startPrice.toFixed(2)}
          </p>
          <p className="card-text mb-1">
            <strong>Current Highest Bid:</strong> ${auction.currentHighestBid.toFixed(2)}
          </p>
          <p className="card-text mb-1">
            <strong>Start Date:</strong>{' '}
            {new Date(auction.startDate).toLocaleString()}
          </p>
          <p className="card-text mb-1">
            <strong>End Date:</strong> {new Date(auction.endDate).toLocaleString()}
          </p>
          <p className="card-text mb-2">
            <strong>Status:</strong>{' '}
            <span
              className={`badge ${
                auction.status === 'LIVE'
                  ? 'bg-success'
                  : auction.status === 'UPCOMING'
                  ? 'bg-warning text-dark'
                  : auction.status === 'ENDED'
                  ? 'bg-secondary'
                  : 'bg-primary'
              }`}
            >
              {auction.status}
            </span>
          </p>

          {isAdmin && (
            <>
              {auction.status === 'LIVE' ? (
                <button
                  className="btn rounded-pill btn-danger flex-fill mt-auto"
                  onClick={() => handleEndAuction(auction.auctionId)}
                >
                  <FontAwesomeIcon icon={faStop} className="me-2" />
                  End Auction
                </button>
              ) : (
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn rounded-pill btn-primary flex-fill"
                    onClick={() => handleUpdateAuctionClick(auction.auctionId)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Update
                  </button>
                  <button
                    className="btn rounded-pill btn-danger flex-fill"
                    onClick={() => handleDeleteAuction(auction.auctionId)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete
                  </button>
                </div>
              )}
            </>
          )}

          <Link to={`/auction/${auction.auctionId}`} className="btn rounded-pill btn-outline-primary mt-2">
            <FontAwesomeIcon icon={faGavel} className="me-2" />
            View Details
          </Link>

          {isBidder && (
            <button
              className="btn rounded-pill btn-primary mt-2"
              disabled={auction.status !== 'LIVE'}
              onClick={() => navigate(`/bid/${auction.auctionId}`)}
            >
              <FontAwesomeIcon icon={faGavel} className="me-2" />
              Place Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // If still loading, use our LoadingSpinner component.
  if (loading) {
    return <LoadingSpinner />;
  }

  // In case of error, show error alert.
  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5 bg-light min-vh-100">
      <div className="container pt-5">
        <h2 className="mb-4 text-center">Auctions</h2>
        <div
          className={`d-flex flex-wrap align-items-center mb-4 ${
            isAdmin ? 'justify-content-between' : 'justify-content-center'
          }`}
        >
          <div className="btn-group" role="group">
            {['ALL', 'UPCOMING', 'LIVE', 'ENDED'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn rounded-pill btn-${
                  selectedStatus === status ? 'primary' : 'outline-primary'
                } me-2 mb-2`}
                onClick={() => handleStatusChange(status)}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {isAdmin && (
            <button
              className="btn rounded-pill btn-success mt-2 mt-md-0"
              onClick={handleCreateAuctionClick}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create Auction
            </button>
          )}
        </div>

        <div className="row">
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction, index) => renderAuctionCard(auction, index))
          ) : (
            <div className="col-12 text-center">
              <h4>No auctions available.</h4>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
