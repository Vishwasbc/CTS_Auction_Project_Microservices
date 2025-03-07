// src/components/user/EditProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
import { format } from 'date-fns';

const EditProfile = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add show/hide toggle for the password field.
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Initial form state includes a password field.
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '', // New field for password update
    firstName: '',
    lastName: '',
    contactNo: '',
    birthDate: '',
    gender: '',
    role: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch the current profile data when the component mounts.
  useEffect(() => {
    if (authData) {
      const fetchProfile = async () => {
        try {
          const { data } = await userService.getProfile(authData.user.sub);
          // Populate formData; note we do not set the password here.
          setFormData({
            userName: data.userName || '',
            email: data.email || '',
            password: '', // remains empty – user can update if desired
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            contactNo: data.contactNo || '',
            // Format birth date as YYYY-MM-DD for <input type="date">
            birthDate: data.birthDate
              ? new Date(data.birthDate).toISOString().split('T')[0]
              : '',
            gender: data.gender || '',
            role: data.role || '',
          });
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [authData]);

  // Update form state on input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle the submission of updated profile data.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the birthDate field into dd-MM-yyyy as required.
    const formattedData = {
      ...formData,
      birthDate: format(new Date(formData.birthDate), 'dd-MM-yyyy'),
    };

    try {
      await userService.updateUser(authData.user.sub, formattedData);
      setMessage('Profile updated successfully.');
      // Redirect back to the profile view after a short delay.
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!authData) {
    return (
      <div className="container mt-5">
        Please log in to edit your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Profile</h2>
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="row">
          {/* Account Details Section */}
          <div className="col-md-6 pe-md-5">
            <h4 className="mb-3 text-secondary">Account Details</h4>
            {/* Username (non-editable) */}
            <div className="mb-3">
              <label htmlFor="userName" className="form-label h5 text-secondary">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} className="text-danger" />
                </span>
                <input
                  id="userName"
                  name="userName"
                  className="form-control"
                  value={formData.userName}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
            {/* Email (non-editable) */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label h5 text-secondary">
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} className="text-danger" />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
            {/* Password (editable) */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label h5 text-secondary">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} className="text-danger" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Enter new password if updating"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: 'pointer' }}
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-danger" />
                </span>
              </div>
            </div>
            {/* Role (non-editable) */}
            <div className="mb-3">
              <label htmlFor="role" className="form-label h5 text-secondary">
                Role
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUserTag} className="text-danger" />
                </span>
                <input
                  id="role"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>
          {/* Personal Information Section */}
          <div className="col-md-6 ps-md-5">
            <h4 className="mb-3 text-secondary">Personal Information</h4>
            {/* First Name */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label h5 text-secondary">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                className="form-control"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            {/* Last Name */}
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label h5 text-secondary">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                className="form-control"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            {/* Contact Number */}
            <div className="mb-3">
              <label htmlFor="contactNo" className="form-label h5 text-secondary">
                Contact Number
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faPhone} className="text-danger" />
                </span>
                <input
                  id="contactNo"
                  name="contactNo"
                  className="form-control"
                  placeholder="Enter contact number"
                  value={formData.contactNo}
                  onChange={handleChange}
                  pattern="\d{10}"
                  title="Contact number must be exactly 10 digits"
                  required
                />
              </div>
            </div>
            {/* Birth Date */}
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label h5 text-secondary">
                Birth Date
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-danger" />
                </span>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  className="form-control"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Gender */}
            <div className="mb-3">
              <label htmlFor="gender" className="form-label h5 text-secondary">
                Gender
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faVenusMars} className="text-danger" />
                </span>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {/* Additional options if needed */}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Update & Cancel Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
