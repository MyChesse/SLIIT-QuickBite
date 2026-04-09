import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SDCanteenProvider } from './context/SDCanteenContext.jsx'   // ← Add this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SDCanteenProvider>                    {/* ← Wrapped here */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SDCanteenProvider>
  </StrictMode>,
)
