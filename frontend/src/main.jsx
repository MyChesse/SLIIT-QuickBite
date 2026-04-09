import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext';
import { SDCanteenProvider } from './context/SDCanteenContext.jsx'   
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SDCanteenProvider>  
      <BrowserRouter>
      <AuthProvider>

        <App />
        <Toaster/>
      </AuthProvider>
      </BrowserRouter>
    </SDCanteenProvider>
  </StrictMode>,
)