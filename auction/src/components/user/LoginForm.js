// src/components/user/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faEye,
  faEyeSlash,
  faUser,
  faLock,
  faGavel,
} from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  // State and context hooks
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { loginUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Event handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.login(formData);
      loginUser(response.data);
      navigate('/home'); // Redirect to /home after successful login
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side Content */}
        <div className="col-md-6 d-flex align-items-center bg-light">
          <div className="p-5">
            <h1 className="mb-4">
              Welcome to{' '}
              <span className="text-primary">AuctionMaster</span>
            </h1>
            <p className="lead">
              <FontAwesomeIcon icon={faGavel} /> Discover rare items, bid
              on your favorite collectibles, and win amazing deals!
            </p>
            <ul className="list-unstyled mt-4">
              <li className="mb-2">
                <FontAwesomeIcon
                  icon={faGavel}
                  className="text-primary me-2"
                />
                Wide range of auction categories
              </li>
              <li className="mb-2">
                <FontAwesomeIcon
                  icon={faGavel}
                  className="text-primary me-2"
                />
                Secure and transparent bidding
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="card shadow p-4"
            style={{ maxWidth: '400px', width: '100%' }}
          >
            <h2 className="text-center mb-4">
              <FontAwesomeIcon icon={faSignInAlt} /> Sign In
            </h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              {message && (
                <div className="alert alert-danger text-center">
                  {message}
                </div>
              )}

              {/* Username Field */}
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="form-label h5"
                >
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="form-control border-start-0"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label h5"
                >
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control border-start-0"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                    title={
                      showPassword ? 'Hide Password' : 'Show Password'
                    }
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary mb-3">
                  <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                </button>
              </div>

              {/* Divider with 'or' */}
              <div className="position-relative mb-3 text-center">
                <hr />
                <span
                  className="position-absolute bg-white px-3"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  or
                </span>
              </div>

              {/* Register Section */}
              <p className="text-center">Don't have an account?</p>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
