import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
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
import StaffOrdersPage from './pages/StaffOrdersPage';
import StaffReportsPage from './pages/StaffReportsPage';
import StaffPromotionSelection from './pages/StaffPromotionSelection';
import StaffCanteenComplaintsPage from './pages/StaffCanteenComplaintsPage';
import CanteenSelection from './pages/CanteenSelection';
import SupportPage from './pages/SupportPage.jsx';
import AdminFeedbackPage from './pages/AdminFeedbackPage.jsx';
import AdminComplaintsPage from './pages/AdminComplaintsPage.jsx';
import AdminInventoryPage from './pages/AdminInventoryPage.jsx';

const App = () => {
<<<<<<< HEAD
=======
  const location = useLocation();

  // hide navbar in selected routes
  const hideNavbarRoutes = ["/cart", "/booking", "/order-status"];
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    hideNavbarRoutes.includes(location.pathname);

>>>>>>> d850e67 (update)
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Staff Routes */}
        <Route
          path="/inventory"
          element={
            <StaffProtectedRoute>
              <SDInventoryPage />
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
          path="/add-promotion"
          element={
            <StaffProtectedRoute>
              <StaffPromotionSelection />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/add-promotion/new-canteen"
          element={
            <StaffProtectedRoute>
              <AddNewCanteenPromotion />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/add-promotion/basement-canteen"
          element={
            <StaffProtectedRoute>
              <AddBasementCanteenPromotion />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/add-promotion/anohana-canteen"
          element={
            <StaffProtectedRoute>
              <AddAnohanaCanteenPromotion />
            </StaffProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/menu" element={<SDMenuPage />} />

        {/* Protected User Routes */}
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

        {/* Protected Admin Routes */}
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

        {/* Support and admin pages */}
        <Route path="/support" element={<SupportPage />} />
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

        {/* Promotions */}
        <Route path="/promotions" element={<DailyPromotions />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

<<<<<<< HEAD
        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
=======
          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
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

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminViewOrders />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <AdminProtectedRoute>
                <SDInventoryPage />
              </AdminProtectedRoute>
            }
          />

          {/* SUPPORT */}
          <Route path="/support" element={<SupportPage />} />
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

          {/* PROMOTIONS */}
          <Route path="/promotions" element={<DailyPromotions />} />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </CartProvider>
>>>>>>> d850e67 (update)
  );
};

export default App;
