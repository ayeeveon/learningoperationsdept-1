import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CertificateGenerator from './pages/CertificateGenerator';
import { AuthProvider, useAuth } from './utils/auth';

// Component to guard private routes
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Main app component
const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generate" element={<PrivateRoute><CertificateGenerator /></PrivateRoute>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
