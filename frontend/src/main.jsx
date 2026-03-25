import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { SDCanteenProvider } from './context/SDCanteenContext.jsx'   // ← Add this
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SDCanteenProvider>                    {/* ← Wrapped here */}
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </SDCanteenProvider>
  </StrictMode>,
)