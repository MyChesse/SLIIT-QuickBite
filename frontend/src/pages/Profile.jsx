import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(passwordData);

    if (result.success) {
      toast.success(result.message || 'Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error(result.message);
    }

    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen w-full">
        <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-slate-200 px-5 py-6">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0056D2] flex items-center justify-center text-white text-lg font-bold shadow-sm">👤</div>
              <div>
                <h2 className="text-[24px] leading-none font-bold text-[#0056D2]">Profile</h2>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mt-1">Account Center</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 rounded-xl bg-[#EAF4FF] text-[#0056D2] px-4 py-3 text-sm font-semibold">
              <span className="text-base">🧑</span><span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <span className="text-base">🔒</span><span>Security</span>
            </button>
            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <span className="text-base">📧</span><span>Notifications</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-bold text-[#0056D2] tracking-tight">My Profile</h1>
                <p className="mt-1 text-sm text-slate-500">View and update your personal account details</p>
              </div>
              <button onClick={() => setEditing(!editing)} className="h-11 rounded-xl border border-[#FF7A00] bg-[#0056D2] px-5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#0056D2] flex items-center justify-center text-3xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{user?.name || 'Unknown User'}</h2>
                  <p className="text-sm text-slate-500">{user?.email || 'No email'}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">Role:</span> {user?.role || 'N/A'}</p>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">Joined:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700">Last Login:</span> {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-[#475569] bg-[#EEF2FF] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#FF7A00] font-semibold">Full Name</p>
                  <p className="mt-1 text-base font-medium text-slate-800">{user?.name || 'N/A'}</p>
                </div>
                <div className="rounded-lg border border-[#475569] bg-[#EEF2FF] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#FF7A00] font-semibold">Email</p>
                  <p className="mt-1 text-base font-medium text-slate-800">{user?.email || 'N/A'}</p>
                </div>
                <div className="rounded-lg border border-[#475569] bg-[#EEF2FF] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#FF7A00] font-semibold">Role</p>
                  <p className="mt-1 text-base font-medium text-slate-800">{user?.role || 'N/A'}</p>
                </div>
                <div className="rounded-lg border border-[#475569] bg-[#EEF2FF] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#FF7A00] font-semibold">Status</p>
                  <p className="mt-1 text-base font-medium text-slate-800">Active</p>
                </div>
              </div>

              {editing && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/40"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#FF7A00] px-4 py-3 text-sm font-semibold text-white hover:bg-[#cc6a00] transition disabled:cursor-not-allowed disabled:opacity-70">
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              )}

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/40"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/40"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full rounded-lg bg-[#0056D2] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {passwordLoading ? 'Updating password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;