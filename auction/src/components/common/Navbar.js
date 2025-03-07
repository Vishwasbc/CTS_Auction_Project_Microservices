import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faGavel,
  faBoxOpen,
  faUserCircle,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const { authData, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <FontAwesomeIcon icon={faHome} /> AuctionPlatform
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-4">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/auctions"
              >
                <FontAwesomeIcon icon={faGavel} className="me-1" /> Auctions
              </NavLink>
            </li>
            <li className="nav-item mx-4">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/bid"
              >
                <FontAwesomeIcon icon={faGavel} className="me-1" /> Bids
              </NavLink>
            </li>
            <li className="nav-item mx-4">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/products"
              >
                <FontAwesomeIcon icon={faBoxOpen} className="me-1" /> Products
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav">
            {authData ? (
              <li className="nav-item dropdown" style={{ position: 'relative' }}>
                <button
                  className="nav-link btn btn-link"
                  onClick={toggleDropdown}
                  style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}
                >
                  <FontAwesomeIcon icon={faUserCircle} /> {authData.user.userName}{' '}
                  <FontAwesomeIcon icon={faCaretDown} />
                </button>
                {isDropdownOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-end show"
                    style={{ display: 'block', position: 'absolute' }}
                  >
                    <Link className="dropdown-item" to="/profile" onClick={closeDropdown}>
                      <FontAwesomeIcon icon={faUser} /> Profile
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <FontAwesomeIcon icon={faSignInAlt} /> Log In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
