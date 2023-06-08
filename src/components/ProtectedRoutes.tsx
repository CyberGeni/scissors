import {  Navigate } from 'react-router-dom';

function ProtectedRoutes({ authenticated, children }) {
    if (!authenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

export default ProtectedRoutes;
