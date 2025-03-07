// src/components/user/UserProfile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';

const UserProfile = () => {
  const { authData } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (authData) {
      const fetchUserData = async () => {
        try {
          const { data } = await userService.getProfile(authData.user.sub);
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUserData();
    }
  }, [authData]);

  if (!authData) {
    return (
      <div className="container mt-5">
        Please log in to view your profile.
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Profile</h2>
      <div className="card p-4">
        <h4 className="mb-3">Account Details</h4>
        <p><strong>Username:</strong> {userData.userName}</p>
        <p><strong>Email:</strong> {userData.email}</p>

        <h4 className="mt-4 mb-3">Personal Information</h4>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p><strong>Contact Number:</strong> {userData.contactNo}</p>
        <p>
          <strong>Birth Date:</strong>{' '}
          {new Date(userData.birthDate).toLocaleDateString()}
        </p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>Role:</strong> {userData.role}</p>

        <div className="mt-4">
          <Link to="/edit-profile" className="btn btn-primary me-2">
            Edit Profile
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate('/home')}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
