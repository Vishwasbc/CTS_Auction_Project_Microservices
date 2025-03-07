// src/components/product/ProductPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExclamationTriangle, faEdit } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine if the current user is a seller.
  const isSeller =
    authData &&
    authData.user &&
    authData.user.roles &&
    typeof authData.user.roles === 'string' &&
    authData.user.roles === 'SELLER';

  // Retrieve current user's seller name.
  const sellerName = authData?.user?.sub || 'Unknown Seller';

  useEffect(() => {
    const fetchProducts = async () => {
      const startTime = Date.now(); // Record the start time.
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        const elapsed = Date.now() - startTime;
        const minDelay = 1000; // Minimum delay of 1.0 seconds.
        if (elapsed < minDelay) {
          setTimeout(() => {
            setLoading(false);
          }, minDelay - elapsed);
        } else {
          setLoading(false);
        }
      }
    };
    fetchProducts();
  }, []);

  // Update the filter status when a button is clicked.
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Filter products based on the selected status.
  const filteredProducts = products.filter((product) => {
    if (selectedStatus === 'ALL') {
      return true;
    } else if (selectedStatus === 'MY_PRODUCTS') {
      return product.sellerName === sellerName;
    } else {
      return product.status === selectedStatus;
    }
  });

  // Navigation functions.
  const handleAddProductClick = () => navigate('/add-product');
  const handleUpdateProductClick = (productId) => navigate(`/update-product/${productId}`);

  if (loading) {
    // Loading state using the LoadingSpinner component.
    return <LoadingSpinner />;
  }

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

  // Conditionally choose container class for filter buttons.
  // If the user is a seller, we show the "Add Product" button, so we use justify-content-between;
  // Otherwise, we center the buttons.
  const filterButtonsContainerClass = isSeller
    ? 'd-flex flex-wrap justify-content-between align-items-center mb-4'
    : 'd-flex flex-wrap justify-content-center align-items-center mb-4';

  return (
    <div>
      <div className="container-fluid bg-light py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Products</h2>

          {/* Status Buttons and Add Product Button (if seller) */}
          <div className={filterButtonsContainerClass}>
            <div className="btn-group" role="group">
              {['ALL', isSeller && 'MY_PRODUCTS', 'PENDING', 'ACTIVE', 'SOLD', 'UNSOLD']
                .filter(Boolean)
                .map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn btn-${selectedStatus === status ? 'primary' : 'outline-primary'} me-2 mb-2 rounded-pill`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status
                      .replace('_', ' ')
                      .split(' ')
                      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                      .join(' ')}
                  </button>
                ))}
            </div>
            {isSeller && (
              <button
                className="btn btn-success mt-2 mt-md-0 rounded-pill"
                onClick={handleAddProductClick}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Product
              </button>
            )}
          </div>

          {/* Product List */}
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={product.productId} className="col-md-6 col-lg-4 mb-4">
                  <div className={`card h-100 shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-light'}`}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text mb-1">
                        <strong>Price:</strong> ${product.price.toFixed(2)}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Seller:</strong> {product.sellerName}
                      </p>
                      <p className="card-text mb-2">
                        <strong>Status:</strong>{' '}
                        <span
                          className={`badge ${
                            product.status === 'ACTIVE'
                              ? 'bg-success'
                              : product.status === 'PENDING'
                              ? 'bg-warning text-dark'
                              : product.status === 'SOLD'
                              ? 'bg-secondary'
                              : product.status === 'UNSOLD'
                              ? 'bg-danger'
                              : 'bg-primary'
                          }`}
                        >
                          {product.status}
                        </span>
                      </p>
                      {selectedStatus === 'MY_PRODUCTS' && product.sellerName === sellerName && (
                        <button
                          className="btn btn-primary mt-auto rounded-pill"
                          onClick={() => handleUpdateProductClick(product.productId)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-2" />
                          Update
                        </button>
                      )}
                      <Link
                        to={`/product/${product.productId}`}
                        className="btn btn-outline-primary mt-2 rounded-pill d-block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                {selectedStatus === 'MY_PRODUCTS' ? (
                  <h4>You have not added any products.</h4>
                ) : (
                  <>
                    <h4>No products available.</h4>
                    <p>Try adjusting your filters or check back later.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
