import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5001/api/admin/dashboard-summary'),
          axios.get('http://localhost:5001/api/admin/users')
        ]);

        setSummary(summaryRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalUsers || 0}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalOrders || 0}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Bookings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalBookings || 0}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Complaints</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalComplaints || 0}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Feedbacks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.totalFeedbacks || 0}</p>
        </div>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Active Promotions</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary.activePromotions || 0}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Management Sections</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Users</button>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Orders</button>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Bookings</button>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Promotions</button>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Feedback</button>
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Complaints</button>
        </div>
      </div>

      {/* Recent Users Table */}
      <div>
        <h3>Recent Users</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((user) => (
              <tr key={user._id}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;