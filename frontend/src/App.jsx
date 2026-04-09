import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SupportPage from './pages/SupportPage.jsx';
import AdminFeedbackPage from './pages/AdminFeedbackPage.jsx';
import AdminComplaintsPage from './pages/AdminComplaintsPage.jsx';

const App = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
