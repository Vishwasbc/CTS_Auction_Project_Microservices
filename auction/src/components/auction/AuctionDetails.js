  // src/components/auction/AuctionDetails.jsx
  import React, { useState, useEffect, useContext } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { AuthContext } from '../../context/AuthContext';
  import auctionService from '../../services/auctionService';
  import productService from '../../services/productService';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
  import LoadingSpinner from '../common/LoadingSpinner';

  const AuctionDetails = () => {
    const { auctionId } = useParams();
    const navigate = useNavigate();

    // State variables to store the auction, associated product, loading, and error status.
    const [auction, setAuction] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get authentication data from context,
    // then determine if the current user is an admin.
    const { authData } = useContext(AuthContext);
    const userRoles = authData?.user?.roles || [];
    const isAdmin = userRoles.includes('ADMIN');

    // Fetch auction details and the associated product once the component mounts.
    useEffect(() => {
      const fetchAuctionDetails = async () => {
        try {
          // Fetch auction details by auctionId.
          const auctionResponse = await auctionService.getAuctionById(auctionId);
          setAuction(auctionResponse.data);

          // Use the productId from auction details to fetch product details.
          const productResponse = await productService.getProductById(auctionResponse.data.productId);
          setProduct(productResponse.data);
        } catch (err) {
          console.error('Failed to fetch auction details:', err);
          setError('Failed to load auction details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchAuctionDetails();
    }, [auctionId]);

    // Handler to start the auction (for admin users).
    const handleStartAuction = async () => {
      try {
        await auctionService.startAuction(auction.auctionId);
        const updatedAuction = await auctionService.getAuctionById(auctionId);
        setAuction(updatedAuction.data);
      } catch (err) {
        console.error('Error starting auction:', err);
        setError('Failed to start auction. Please try again.');
      }
    };

    // Handler to end the auction (for admin users).
    const handleEndAuction = async () => {
      try {
        await auctionService.endAuction(auction.auctionId);
        const updatedAuction = await auctionService.getAuctionById(auctionId);
        setAuction(updatedAuction.data);
      } catch (err) {
        console.error('Error ending auction:', err);
        setError('Failed to end auction. Please try again.');
      }
    };

    // If loading is true, render the LoadingSpinner component.
    if (loading) {
      return <LoadingSpinner />;
    }

    // If there's an error or auction data isn't available, display an error alert.
    if (error || !auction) {
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
      <div className="container mt-5">
        {/* Back button */}
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/auctions')}>
          Back to Auctions
        </button>
        
        <h2 className="mb-4 text-center">Auction Details</h2>

        {/* Auction Details Card */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Auction #{auction.auctionId}</h5>
            <p className="card-text">
              <strong>Status:</strong>{' '}
              <span className={
                auction.status === 'LIVE' ? 'text-success' :
                auction.status === 'UPCOMING' ? 'text-warning' :
                auction.status === 'ENDED' ? 'text-secondary' : 'text-primary'
              }>
                {auction.status}
              </span>
            </p>
            <p className="card-text">
              <strong>Start Date:</strong> {new Date(auction.startDate).toLocaleString()}
            </p>
            <p className="card-text">
              <strong>End Date:</strong> {new Date(auction.endDate).toLocaleString()}
            </p>
            <p className="card-text">
              <strong>Start Price:</strong> ${auction.startPrice.toFixed(2)}
            </p>
            <p className="card-text">
              <strong>Current Highest Bid:</strong> ${auction.currentHighestBid.toFixed(2)}
            </p>
            <p className="card-text">
              <strong>Minimum Bid Increment:</strong> ${auction.minBidAmount.toFixed(2)}
            </p>
            
            {/* Admin controls for starting or ending the auction */}
            {isAdmin && (
              <div className="mt-3">
                {auction.status === 'UPCOMING' && (
                  <button className="btn btn-primary" onClick={handleStartAuction}>
                    Start Auction
                  </button>
                )}
                {auction.status === 'LIVE' && (
                  <button className="btn btn-danger" onClick={handleEndAuction}>
                    End Auction
                  </button>
                )}
              </div>
            )}

            {/* Render product details if available */}
            {product && (
              <>
                <hr />
                <h5>Product Details</h5>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text">
                      <strong>Description:</strong> {product.productDescription || 'No description available.'}
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ${product.price.toFixed(2)}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {product.status}
                    </p>
                    <p className="card-text">
                      <strong>Seller:</strong> {product.sellerName || 'Seller information not available.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default AuctionDetails;
