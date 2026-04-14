import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import StaffProtectedRoute from './components/StaffProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Pages
import SDInventoryPage from './pages/SDInventoryPage';
import SDMenuPage from './pages/SDMenuPage';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DailyPromotions from './pages/DailyPromotions';
import AddNewCanteenPromotion from './pages/AddNewCanteenPromotion';
import AddBasementCanteenPromotion from './pages/AddBasementCanteenPromotion';
import AddAnohanaCanteenPromotion from './pages/AddAnohanaCanteenPromotion';
import CanteenSelection from './pages/CanteenSelection';
import SupportPage from './pages/SupportPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminInventoryPage from './pages/AdminInventoryPage';
import StaffOrdersPage from './pages/StaffOrdersPage';
import StaffReportsPage from './pages/StaffReportsPage';
import StaffPromotionSelection from './pages/StaffPromotionSelection';
import StaffCanteenComplaintsPage from './pages/StaffCanteenComplaintsPage';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes - No login required for menu */}
        <Route path="/menu" element={<SDMenuPage />} />

        {/* Staff Routes - Only staff with assigned canteen */}
        <Route
          path="/inventory"
          element={
            <StaffProtectedRoute>
              <SDInventoryPage />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <StaffProtectedRoute>
              <StaffOrdersPage />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <StaffProtectedRoute>
              <StaffReportsPage />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <StaffProtectedRoute>
              <StaffCanteenComplaintsPage />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/add-promotion"
          element={
            <StaffProtectedRoute>
              <StaffPromotionSelection />
            </StaffProtectedRoute>
          }
        />

        {/* Protected General User Routes (Students + Staff) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/promotions"
          element={
            <AdminProtectedRoute>
              <CanteenSelection />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminProtectedRoute>
              <AdminFeedbackPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <AdminProtectedRoute>
              <AdminComplaintsPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <AdminProtectedRoute>
              <AdminInventoryPage />
            </AdminProtectedRoute>
          }
        />

        {/* Promotion Routes */}
        <Route path="/promotions" element={<DailyPromotions />} />
        <Route
          path="/admin/promotions/new-canteen"
          element={
            <AdminProtectedRoute>
              <AddNewCanteenPromotion />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/promotions/basement-canteen"
          element={
            <AdminProtectedRoute>
              <AddBasementCanteenPromotion />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/promotions/anohana-canteen"
          element={
            <AdminProtectedRoute>
              <AddAnohanaCanteenPromotion />
            </AdminProtectedRoute>
          }
        />

        {/* Support */}
        <Route path="/support" element={<SupportPage />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;