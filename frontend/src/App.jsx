import React from 'react';
<<<<<<< HEAD
import { Routes, Route, Navigate, Link, useLocation } from 'react-router';
import DailyPromotions from './pages/DailyPromotions';
import AddNewCanteenPromotion from './pages/AddNewCanteenPromotion';
import AddBasementCanteenPromotion from './pages/AddBasementCanteenPromotion';
import AddAnohanaCanteenPromotion from './pages/AddAnohanaCanteenPromotion';

const App = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">Campus Promotions</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <Link
              to="/promotions"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/promotions') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Daily Promotions
            </Link>
            <Link
              to="/admin/promotions/new-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/new-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              New Canteen
            </Link>
            <Link
              to="/admin/promotions/basement-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/basement-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Basement Canteen
            </Link>
            <Link
              to="/admin/promotions/anohana-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/anohana-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Anohana Canteen
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/promotions" replace />} />
          <Route path="/promotions" element={<DailyPromotions />} />
          <Route path="/admin/promotions/new-canteen" element={<AddNewCanteenPromotion />} />
          <Route path="/admin/promotions/basement-canteen" element={<AddBasementCanteenPromotion />} />
          <Route path="/admin/promotions/anohana-canteen" element={<AddAnohanaCanteenPromotion />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
=======
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SupportPage from './pages/SupportPage.jsx';
import AdminFeedbackPage from './pages/AdminFeedbackPage.jsx';
import AdminComplaintsPage from './pages/AdminComplaintsPage.jsx';

const App = () => {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navigation */}
        <nav style={{
          backgroundColor: '#f8f9fa',
          padding: '10px 20px',
          borderBottom: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Link 
              to="/support" 
              style={{
                marginRight: '20px',
                textDecoration: 'none',
                color: '#007bff',
                fontWeight: 'bold'
              }}
            >
              Support
            </Link>
            <Link 
              to="/admin/feedback" 
              style={{
                marginRight: '20px',
                textDecoration: 'none',
                color: '#007bff'
              }}
            >
              Admin Feedback
            </Link>
            <Link 
              to="/admin/feedback" 
              style={{
                marginRight: '20px',
                textDecoration: 'none',
                color: '#007bff'
              }}
            >
              Admin Feedback
            </Link>
            <Link 
              to="/admin/complaints" 
              style={{
                marginRight: '20px',
                textDecoration: 'none',
                color: '#007bff'
              }}
            >
              Admin Complaints
            </Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/support" element={<SupportPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
          
          {/* Default redirect to support page */}
          <Route path="/" element={<SupportPage />} />
          
          {/* Catch all route */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
              <Link 
                to="/support"
                style={{
                  color: '#007bff',
                  textDecoration: 'none'
                }}
              >
                Go to Support Page
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
>>>>>>> nuleka
