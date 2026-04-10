import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// 🔥 CART CONTEXT (IMPORTANT ADDITION)
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import StaffProtectedRoute from "./components/StaffProtectedRoute";

// Pages
import SDInventoryPage from "./pages/SDInventoryPage";
import SDMenuPage from "./pages/SDMenuPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminViewOrders from "./pages/AdminViewOrders";
import DailyPromotions from "./pages/DailyPromotions";
import AddNewCanteenPromotion from "./pages/AddNewCanteenPromotion";
import AddBasementCanteenPromotion from "./pages/AddBasementCanteenPromotion";
import AddAnohanaCanteenPromotion from "./pages/AddAnohanaCanteenPromotion";
import CanteenSelection from "./pages/CanteenSelection";
import SupportPage from "./pages/SupportPage.jsx";
import AdminFeedbackPage from "./pages/AdminFeedbackPage.jsx";
import AdminComplaintsPage from "./pages/AdminComplaintsPage.jsx";

// 🛒 NEW PAGES (MAKE SURE THESE EXIST)
import CartPage from "./components/CartPage";
import BookingPage from "./components/BookingPage";
import OrderStatusPage from "./components/OrderStatusPage";
import MenuPage from "./components/MenuPage.jsx";

const App = () => {
  const location = useLocation();

  // hide navbar in selected routes
  const hideNavbarRoutes = ["/cart", "/booking", "/order-status"];
  const hideNavbar =
    location.pathname.startsWith("/admin/promotions") ||
    hideNavbarRoutes.includes(location.pathname);

  return (
    <CartProvider>
      <div>
        {!hideNavbar && <Navbar />}

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* STUDENT MENU */}
          <Route path="/menu" element={<SDMenuPage />} />

          {/* 🛒 CART FLOW (NEW IMPORTANT ROUTES) */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="/menu2" element={<MenuPage />} />

          {/* STAFF ROUTES */}
          <Route
            path="/inventory"
            element={
              <StaffProtectedRoute>
                <SDInventoryPage />
              </StaffProtectedRoute>
            }
          />

          {/* USER ROUTES */}
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

          {/* ADMIN ROUTES */}
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

          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminViewOrders />
              </AdminProtectedRoute>
            }
          />

          {/* SUPPORT */}
          <Route path="/support" element={<SupportPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/complaints" element={<AdminComplaintsPage />} />

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
  );
};

export default App;
