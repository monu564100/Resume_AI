import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import UploadAnalyze from './pages/UploadAnalyze';
import Results from './pages/Results';
import Analyze from './pages/Analyze';
import RoleDetails from './pages/RoleDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Careers from './pages/Careers';
import { AnimatePresence } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider } from './context/AuthContext';
// Protected route component
const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  // For development, always allow access since SKIP_AUTH=true in backend
  const isAuthenticated = true; // localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export function App() {
  return <AuthProvider>
      <ResumeProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<ProtectedRoute>
                    <UploadAnalyze />
                  </ProtectedRoute>} />
              <Route path="/upload-analyze" element={<ProtectedRoute>
                    <UploadAnalyze />
                  </ProtectedRoute>} />
              <Route path="/analyze" element={<ProtectedRoute>
                    <Analyze />
                  </ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute>
                    <Results />
                  </ProtectedRoute>} />
              <Route path="/role/:id" element={<ProtectedRoute>
                    <RoleDetails />
                  </ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>} />
              <Route path="/careers" element={<ProtectedRoute>
                    <Careers />
                  </ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Router>
      </ResumeProvider>
    </AuthProvider>;
}