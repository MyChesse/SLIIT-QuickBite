import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { SDCanteenContext } from '../context/SDCanteenContext';
import { useAuth } from '../context/AuthContext';

const SDStaffSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { selectedCanteenId, canteens, clearCanteen } = useContext(SDCanteenContext);

    const handleLogout = () => {
        clearCanteen();
        logout();
        navigate('/login');
    };

    const currentCanteen = canteens.find(
        (canteen) => canteen._id?.toString() === selectedCanteenId?.toString()
    );

    const getAddPromotionPath = () => {
        const canteenName = (currentCanteen?.name || '').trim().toLowerCase();

        if (canteenName === 'main canteen') {
            return '/add-promotion/new-canteen';
        }

        if (canteenName === 'hostel canteen') {
            return '/add-promotion/basement-canteen';
        }

        if (canteenName === 'mini canteen') {
            return '/add-promotion/anohana-canteen';
        }

        return '/add-promotion';
    };

    const addPromotionPath = getAddPromotionPath();

    const navItems = [
        { path: '/inventory', label: 'Inventory', icon: 'inventory_2', active: location.pathname === '/inventory' },
        { path: '/orders', label: 'Orders', icon: 'shopping_cart', active: location.pathname === '/orders' },
        { path: '/reports', label: 'Reports', icon: 'analytics', active: location.pathname === '/reports' },
        { path: '/complaints', label: 'Complaints', icon: 'report_problem', active: location.pathname === '/complaints' },
        { path: addPromotionPath, label: 'Add Promotion', icon: 'local_offer', active: location.pathname.startsWith('/add-promotion') },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-40 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-8 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                        Q
                    </div>
                    <div>
                        <span className="font-bold text-2xl tracking-tighter text-gray-900">QuickBite</span>
                        <p className="text-xs text-gray-500 -mt-1 ">STAFF PORTAL</p>
                    </div>
                </div>
            </div>

            {/* Current Canteen */}
            <div className="px-6 py-5 border-b border-gray-100 bg-blue-50">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-widest">CURRENT CANTEEN</p>
                <p className="font-semibold text-gray-800 mt-1">
                    {currentCanteen?.name || (selectedCanteenId ? 'Assigned Canteen' : 'No canteen selected')}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                                item.active 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom User Info */}
            <div className="p-6 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-200 rounded-2xl px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl">
                        👨‍💼
                    </div>
                    <div className="flex flex-col px-3 py-1 rounded-lg">
                        <p className="font-medium text-sm text-gray-800 ">Staff User</p>
                        <p className="text-xs text-gray-500">Canteen Administrator</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default SDStaffSidebar;