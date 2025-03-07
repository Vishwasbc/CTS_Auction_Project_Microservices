// src/App.js

import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginForm from './components/user/LoginForm';
import RegisterForm from './components/user/RegistrationForm';
import UserProfile from './components/user/UserProfile';
import EditProfile from './components/user/EditProfile';

import ProductPage from './pages/ProductPage';
import AddProduct from './components/product/AddProduct';
import UpdateProduct from './components/product/UpdateProduct';
import ProductDetails from './components/product/ProductDetails';

// Auction Components
import AuctionPage from './pages/AuctionPage';
import CreateAuction from './components/auction/CreateAuction';
import UpdateAuction from './components/auction/UpdateAuction';
import AuctionDetails from './components/auction/AuctionDetails';

// Bid Components
import PlaceBidPage from './components/bids/PlaceBid';
import BidPage from './pages/BidPage';
import AuctionBidsPage from './components/bids/AuctionBidsPage';

import { AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';

function App() {
  const { authData } = useContext(AuthContext);
  const location = useLocation();

  // Determine authentication and authorization status
  const isAuthenticated = !!authData;

  // Normalize user roles to an array
  const userRolesRaw = authData?.user?.roles || [];
  const userRoles = Array.isArray(userRolesRaw) ? userRolesRaw : [userRolesRaw];

  const isSeller =
    isAuthenticated && userRoles.includes('SELLER');

  const isBidder =
    isAuthenticated && userRoles.includes('BIDDER');

  const isAdmin =
    isAuthenticated && userRoles.includes('ADMIN');

  // Bidders and Sellers can view auction details
  const canViewAuctionDetails = isBidder || isSeller;

  // Define paths where the Navbar should be hidden
  const hideNavbarPaths = ['/', '/login', '/register'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Landing, Login, and Registration */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginForm />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <RegisterForm />
          }
        />

        {/* Home, Profile, and Edit Profile */}
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/edit-profile"
          element={isAuthenticated ? <EditProfile /> : <Navigate to="/" replace />}
        />

        {/* Product Routes */}
        <Route
          path="/products"
          element={isAuthenticated ? <ProductPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/product/:productId"
          element={isAuthenticated ? <ProductDetails /> : <Navigate to="/" replace />}
        />
        <Route
          path="/add-product"
          element={isSeller ? <AddProduct /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/update-product/:productId"
          element={isSeller ? <UpdateProduct /> : <Navigate to="/home" replace />}
        />

        {/* Auction Routes */}
        <Route
          path="/auctions"
          element={isAuthenticated ? <AuctionPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/auction/:auctionId"
          element={
            isAdmin || canViewAuctionDetails ? <AuctionDetails /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path="/create-auction"
          element={isAdmin ? <CreateAuction /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/update-auction/:auctionId"
          element={isAdmin ? <UpdateAuction /> : <Navigate to="/home" replace />}
        />

        {/* Bid Routes */}
        {/* Route for placing a bid */}
        <Route
          path="/bid/:auctionId"
          element={isAuthenticated ? <PlaceBidPage /> : <Navigate to="/" replace />}
        />
        {/* Route for viewing a bid overview */}
        <Route
          path="/bid"
          element={isAuthenticated ? <BidPage /> : <Navigate to="/" replace />}
        />
        {/* Route for viewing all bids for an auction */}
        <Route
          path="/bids/:auctionId"
          element={isAuthenticated ? <AuctionBidsPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
