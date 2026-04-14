import { useNavigate } from 'react-router-dom';
import StaffSidebarLayout from '../components/StaffSidebarLayout';

const StaffPromotionSelection = () => {
  const navigate = useNavigate();

  const canteenVisuals = {
    'Main Canteen': {
      tag: 'Basement Building',
      image:
        'https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?auto=format&fit=crop&w=1200&q=80'
    },
    'Hostel Canteen': {
      tag: 'Hostel Block',
      image:
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80'
    },
    'Mini Canteen': {
      tag: 'Faculty Area',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    }
  };

  const canteens = [
    {
      name: 'Main Canteen',
      description: 'Add a new promotion for the Main Canteen',
      route: '/add-promotion/new-canteen',
      icon: '🏫'
    },
    {
      name: 'Hostel Canteen',
      description: 'Add a new promotion for the Hostel Canteen',
      route: '/add-promotion/basement-canteen',
      icon: '🏢'
    },
    {
      name: 'Mini Canteen',
      description: 'Add a new promotion for the Mini Canteen',
      route: '/add-promotion/anohana-canteen',
      icon: '🌸'
    }
  ];

  return (
    <StaffSidebarLayout contentClassName="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Select Campus Canteen
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Pick the canteen you manage and create a new promotion for it.
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
                <span className="text-lg" aria-hidden="true">
                  {canteen.icon}
                </span>
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
                <span aria-hidden="true" className="text-2xl leading-none">
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </StaffSidebarLayout>
  );
};

export default StaffPromotionSelection;
