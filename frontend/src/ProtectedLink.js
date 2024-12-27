import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedLink = ({ to, children, style, invert = false }) => {
  const { user } = useAuth();

  // Decide whether to render based on the `invert` prop
  const shouldRender = invert ? !user : user;

  if (!shouldRender) {
    return null;
  }

  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
};

export default ProtectedLink;