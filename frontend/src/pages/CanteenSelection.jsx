import { useNavigate } from 'react-router-dom';

const CanteenSelection = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">Campus Promotions</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin/promotions/daily')}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20"
            >
              Daily Promotions
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-2xl px-4 py-2 text-sm font-semibold bg-white text-neutral hover:bg-slate-100"
            >
              User Management
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Select Canteen for Promotion</h2>
          <p className="text-slate-600">Choose which canteen you want to add a promotion for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canteens.map((canteen) => (
            <div
              key={canteen.name}
              onClick={() => navigate(canteen.route)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{canteen.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{canteen.name}</h3>
                <p className="text-slate-600 text-sm">{canteen.description}</p>
                <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                  Add Promotion
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