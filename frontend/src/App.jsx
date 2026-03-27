import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router';
import MenuPage from './components/MenuPage.jsx';
import CartPage from './components/CartPage.jsx';
import BookingPage from './components/BookingPage.jsx';
import OrderStatusPage from './components/OrderStatusPage.jsx';
import './App.css';

const AppContent = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation();

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    console.log('Item added to cart:', item.name);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={styles.app}>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            🍽️ University Canteen
          </Link>
          <ul style={styles.navMenu}>
            <li style={styles.navItem}>
              <Link to="/" style={{...styles.navLink, ...(location.pathname === '/' ? styles.active : {})}}>
                Menu
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/cart" style={{...styles.navLink, ...(location.pathname === '/cart' ? styles.active : {})}}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/booking" style={{...styles.navLink, ...(location.pathname === '/booking' ? styles.active : {})}}>
                Booking
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/order-status" style={{...styles.navLink, ...(location.pathname === '/order-status' ? styles.active : {})}}>
                Order Status
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<MenuPage cart={cart} addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
          <Route path="/booking" element={<BookingPage cart={cart} clearCart={clearCart} />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
        </Routes>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2026 University Canteen  Management System</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: {
    backgroundColor: '#ffffff',
    padding: '1rem 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e40af',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  navMenu: {
    display: 'flex',
    listStyle: 'none',
    gap: '2rem',
    margin: 0,
    padding: 0
  },
  navItem: {
    margin: 0
  },
  navLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s'
  },
  active: {
    color: '#1e40af',
    borderBottom: '2px solid #1e40af'
  },
  mainContent: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px'
  },
  footer: {
    backgroundColor: '#2d3748',
    color: '#ffffff',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto'
  }
};

export default App;