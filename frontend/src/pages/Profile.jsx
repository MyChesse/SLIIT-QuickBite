import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      toast.success('Profile updated successfully!');
      setEditing(false);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h1>Profile</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            marginRight: '1rem'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.role}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Account Information</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>Full Name:</strong> {user?.name}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Role:</strong> {user?.role}
          </div>
          <div>
            <strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <strong>Last Login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => setEditing(!editing)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {editing ? 'Cancel Edit' : 'Edit Profile'}
        </button>

        {editing && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;