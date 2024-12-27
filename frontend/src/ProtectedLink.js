import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedLink = ({ to, children, style }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
};

export default ProtectedLink;
