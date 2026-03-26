import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>User Dashboard</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Welcome, {user?.name}!</h2>
        <p>Logged in as: {user?.role === 'student' ? 'Student' : 'Staff'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Quick Actions</h3>
          <ul>
            <li>View Menu</li>
            <li>Place Order</li>
            <li>View Order History</li>
          </ul>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Account Info</h3>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Recent Activity</h3>
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;