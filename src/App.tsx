import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubscriptionPage from './pages/SubscriptionPage';
import UserTypePage from './pages/UserTypePage';
import OriginSelectPage from './pages/OriginSelectPage';
import OCRScanPage from './pages/OCRScanPage';
import ManualInputPage from './pages/ManualInputPage';
import GeneralInputPage from './pages/GeneralInputPage';
import AddressReviewPage from './pages/AddressReviewPage';
import NavigationPage from './pages/NavigationPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
      <Route path="/user-type" element={<ProtectedRoute><UserTypePage /></ProtectedRoute>} />
      <Route path="/origin-select" element={<ProtectedRoute><OriginSelectPage /></ProtectedRoute>} />
      <Route path="/ocr-scan" element={<ProtectedRoute><OCRScanPage /></ProtectedRoute>} />
      <Route path="/manual-input" element={<ProtectedRoute><ManualInputPage /></ProtectedRoute>} />
      <Route path="/general-input" element={<ProtectedRoute><GeneralInputPage /></ProtectedRoute>} />
      <Route path="/address-review" element={<ProtectedRoute><AddressReviewPage /></ProtectedRoute>} />
      <Route path="/navigation" element={<ProtectedRoute><NavigationPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
