import React from 'react';
import { useLocation } from 'react-router-dom';

export default function(props) {
  const location = useLocation();
  return <div>Page One {location.pathname}</div>
}