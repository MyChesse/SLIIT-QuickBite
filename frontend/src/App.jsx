import React from 'react';
import { Routes, Route } from 'react-router';

// Pages
import SDInventoryPage from './pages/SDInventoryPage';
import SDMenuPage from './pages/SDMenuPage';        // ← New Student Menu Page

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Staff Routes */}
        <Route path="/inventory" element={<SDInventoryPage />} />

        {/* Student Routes */}
        <Route path="/menu" element={<SDMenuPage />} />
        <Route path="/" element={<SDMenuPage />} />           {/* Default page = Menu */}

        {/* Future routes can be added here */}
      </Routes>
    </div>
  );
};

export default App;