import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f5f5f5', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
          {user?.role === 'admin' ? (
            <Link to="/admin/dashboard" style={{ marginRight: '1rem', textDecoration: 'none' }}>Admin Dashboard</Link>
          ) : (
            <>
              <Link to="/dashboard" style={{ marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link>
            </>
          )}
        </div>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;