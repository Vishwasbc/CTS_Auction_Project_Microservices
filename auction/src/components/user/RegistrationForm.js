import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import userService from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faCalendarAlt,
  faVenusMars,
  faUserTag,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import './styles/Register.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    role: 'BIDDER',
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    birthDate: '',
    gender: '',
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // Validate password: At least 8 characters, at least one letter and one number.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setMessage('Password must be at least 8 characters long and include at least one letter and one number.');
      return;
    }

    // Validate birth date: User must be at least 18 years old
    const birthDateObj = new Date(formData.birthDate);
    const age = differenceInYears(new Date(), birthDateObj);
    if (age < 18) {
      setMessage('You must be at least 18 years old to register.');
      return;
    }

    // Format birth date as needed (for example, dd-MM-yyyy)
    const formattedData = {
      ...formData,
      birthDate: format(new Date(formData.birthDate), 'dd-MM-yyyy'),
    };

    try {
      await userService.register(formattedData);
      setMessage('Registration successful. Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data || 'Registration failed.');
    }
  };

  return (
    <div className="register-page">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ maxWidth: '900px', width: '100%', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 text-primary">
            <FontAwesomeIcon icon={faUserPlus} /> Register
          </h2>
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="row">
              {/* Account Details Section */}
              <div className="col-md-6 pe-md-5">
                <h3 className="mb-4 text-secondary">Account Details</h3>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label h5 text-secondary">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUser} className="text-danger" />
                    </span>
                    <input
                      id="userName"
                      name="userName"
                      className="form-control"
                      placeholder="Enter username"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label h5 text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} className="text-danger" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      title="Password must contain at least 8 characters, a letter and a number"
                      required
                      autoComplete='off'
                    />
                    <span
                      className="input-group-text password-toggle"
                      onClick={togglePasswordVisibility}
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-danger" />
                    </span>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label h5 text-secondary">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLock} className="text-danger" />
                    </span>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                    <span
                      className="input-group-text password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-danger" />
                    </span>
                  </div>
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label h5 text-secondary">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faEnvelope} className="text-danger" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Role */}
                <div className="mb-4">
                  <label htmlFor="role" className="form-label h5 text-secondary">Role</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faUserTag} className="text-danger" />
                    </span>
                    <select
                      id="role"
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="BIDDER">Bidder</option>
                      <option value="SELLER">Seller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className="col-md-1 d-none d-md-flex align-items-center">
                <div className="divider-line"></div>
              </div>

              {/* Personal Information Section */}
              <div className="col-md-5 ps-md-5">
                <h3 className="mb-4 text-secondary">Personal Information</h3>
                {/* First Name */}
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label h5 text-secondary">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                  />
                </div>
                {/* Last Name */}
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label h5 text-secondary">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                  />
                </div>
                {/* Contact Number */}
                <div className="mb-3">
                  <label htmlFor="contactNo" className="form-label h5 text-secondary">Contact Number</label>
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faPhone} className="text-danger" /></span>
                    <input
                      id="contactNo"
                      name="contactNo"
                      className="form-control"
                      placeholder="Contact Number"
                      value={formData.contactNo}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Birth Date */}
                <div className="mb-3">
                  <label htmlFor="birthDate" className="form-label h5 text-secondary">Birth Date</label>
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} className="text-danger" /></span>
                    <input
                      id="birthDate"
                      type="date"
                      name="birthDate"
                      className="form-control"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                  </div>
                </div>
                {/* Gender */}
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label h5 text-secondary">Gender</label>
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faVenusMars} className="text-danger" /></span>
                    <select
                      id="gender"
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <br/>
            <p className="text-center">
              Already have an account?{' '}
              <a href="/login" className="text-decoration-none text-primary">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
