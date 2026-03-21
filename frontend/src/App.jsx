import React from 'react'
import { Routes, Route } from 'react-router'
import SDInventoryPage from './pages/SDInventoryPage'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Staff Inventory Page */}
        <Route path="/inventory" element={<SDInventoryPage />} />
        
        {/* You can add more routes later */}
        <Route path="/" element={<h1 className="text-center mt-20 text-2xl">Welcome to SLIIT QuickBite</h1>} />
      </Routes>
    </div>
  )
}

export default App