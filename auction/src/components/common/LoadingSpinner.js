// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ height: '60vh' }}
  >
    <div className="w-50 mb-3">
      <div className="progress" style={{ height: '12px' }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-success"
          role="progressbar"
          style={{ width: '100%' }}
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
    <div
      className="text-center"
      style={{
        color: '#343a40',
        fontStyle: 'italic',
        letterSpacing: '0.05rem'
      }}
    >
      Loading, please wait...
    </div>
  </div>
);

export default LoadingSpinner;
