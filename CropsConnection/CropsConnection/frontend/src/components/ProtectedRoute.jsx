import React from 'react';

// Temporarily disable auth checks so the app is accessible without login.
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;
