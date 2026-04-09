import React from 'react';

import { Routes, Route, Navigate, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import StaffProtectedRoute from './components/StaffProtectedRoute';


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

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Staff Routes */}
        <Route 
        path="/inventory" 
        element={
            <StaffProtectedRoute>
                <SDInventoryPage />
            </StaffProtectedRoute>
        } 
    />
        {/* Student Routes */}
        <Route path="/menu" element={<SDMenuPage />} />
                
         <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/promotions" element={<AdminProtectedRoute><CanteenSelection /></AdminProtectedRoute>} />

        
      </Routes>
    </div>
  );
};







const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin/promotions');

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
       

        {/* Protected user routes */}
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

        {/* Protected admin routes */}
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
          path="/admin/promotions/daily"
          element={
            <AdminProtectedRoute>
              <DailyPromotions />
            </AdminProtectedRoute>
          }
        />
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

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

  {/*const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};*/}

export default App;
