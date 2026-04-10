import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const CanteenSelection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canteenVisuals = {
    'New Canteen': {
      tag: 'New Building',
      image:
        'https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?auto=format&fit=crop&w=1200&q=80'
    },
    'Basement Canteen': {
      tag: 'Main Building',
      image:
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80'
    },
    'Anohana Canteen': {
      tag: 'Anohana In front of the business school',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    }
  };

  const canteens = [
    {
      name: 'New Canteen',
      description: 'Add promotions for the New Canteen',
      route: '/admin/promotions/new-canteen',
      icon: '🏫'
    },
    {
      name: 'Basement Canteen',
      description: 'Add promotions for the Basement Canteen',
      route: '/admin/promotions/basement-canteen',
      icon: '🏢'
    },
    {
      name: 'Anohana Canteen',
      description: 'Add promotions for the Anohana Canteen',
      route: '/admin/promotions/anohana-canteen',
      icon: '🌸'
    }
  ];

  return (
    <div className="min-h-screen bg-[#eef2f8] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white px-5 py-6 lg:w-[250px] lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                🎓
              </div>
              <div>
                <h2 className="text-[28px] font-bold leading-none text-blue-900">Admin Portal</h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Canteen Management
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span className="text-base">👥</span>
              <span>User Management</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              <span className="text-base">🍽️</span>
              <span>Promotion Management</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              <span className="text-base">📦</span>
              <span>Inventory</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              <span className="text-base">🛒</span>
              <span>Orders</span>
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              <span className="text-base">📊</span>
              <span>Analytics</span>
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
                <p className="truncate text-xs text-slate-500">{user?.email || 'admin@sliit.lk'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Select Campus Canteen</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Welcome back, Administrator. Select a specific location below to manage menu offerings,
            active promotions, and inventory levels for the day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {canteens.map((canteen) => (
            <div
              key={canteen.name}
              onClick={() => navigate(canteen.route)}
              className="group overflow-hidden rounded-2xl border border-[#d8deea] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(15,79,185,0.45)]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={canteenVisuals[canteen.name]?.image}
                  alt={canteen.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/25 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  <span className="text-lg" aria-hidden="true">{canteen.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-[0.2em]">
                    {canteenVisuals[canteen.name]?.tag || 'Campus'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">{canteen.name}</h3>
                <p className="min-h-[84px] text-lg leading-relaxed text-slate-600">{canteen.description}</p>

                <button className="inline-flex w-full items-center justify-between rounded-xl bg-[#0f4fb9] px-5 py-3 text-base font-bold text-white transition hover:bg-[#0c4299]">
                  Add Promotion
                  <span aria-hidden="true" className="text-2xl leading-none">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        </main>
      </div>
    </div>
  );
};

export default CanteenSelection;