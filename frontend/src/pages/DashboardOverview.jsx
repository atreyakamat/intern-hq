import React from 'react';
import { Navigate } from 'react-router-dom';

export default function DashboardOverview() {
  return <Navigate to="/dashboard" replace />;
}
