import { useNavigate } from 'react-router';

const CanteenSelection = () => {
  const navigate = useNavigate();

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
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#eef2f8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1d4fa5]">Campus Promotions</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Admin Dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin/promotions/daily')}
              className="rounded-xl bg-[#0f4fb9] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c4299]"
            >
              Daily Promotions
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              User Management
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
  );
};

export default CanteenSelection;