// src/components/HomePage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get the user's name from authData; default to "Guest" if not available
  const userName = authData && authData.user && authData.user.sub ? authData.user.sub : 'Guest';

  return (
    <div>
      {/* Header Section with a Solid Background */}
      <header className="bg-secondary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4">Hello, {userName}!</h1>
          <p className="lead">
            Welcome to AuctionMaster. Discover live auctions and exclusive collectibles.
          </p>
          <button 
            className="btn btn-light btn-lg mt-3" 
            onClick={() => navigate('/auctions')}
          >
            Browse Auctions
          </button>
        </div>
      </header>
      <main className="container my-5">
        <section className="mb-5">
          <h2>About AuctionMaster</h2>
          <p>
            AuctionMaster is your one-stop platform for live auctions and rare collectibles.
            Our mission is to provide a secure and engaging experience where every bid counts.
            Join thousands of users who trust us to bring them exclusive deals and unique finds.
          </p>
        </section>
        <section>
          <h2>How It Works</h2>
          <ol className="mt-3" style={{ fontSize: '1.1rem' }}>
            <li>
              <strong>Register:</strong> Create your profile and join our community.
            </li>
            <li className="mt-2">
              <strong>Browse & Bid:</strong> Explore live auctions and place your bids.
            </li>
            <li className="mt-2">
              <strong>Win & Enjoy:</strong> Secure your win, complete your purchase, and enjoy your unique item.
            </li>
          </ol>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-3">
        <div className="container text-center">
          &copy; {new Date().getFullYear()} AuctionMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
