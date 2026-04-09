import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import SDCanteenSelector from './SDCanteenSelector';
import toast from 'react-hot-toast';

const SDHeader = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [cartCount] = useState(2);
    const [pendingOrders] = useState(1);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Get user initials for avatar
    const getInitials = () => {
        if (!user?.name) return 'U';
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                {/* Left - Brand + Canteen Selector */}
                <div className="flex items-center gap-8">
                    <Link to={isAuthenticated ? (user?.role === 'staff' ? '/inventory' : '/menu') : '/menu'} className="flex items-center gap-2">
                        <span className="text-3xl font-black text-blue-600 tracking-tighter">QuickBite</span>
                        <span className="material-symbols-outlined text-2xl text-blue-600">restaurant_menu</span>
                    </Link>
                    <SDCanteenSelector />
                </div>

                {/* Search Bar - Only show on menu page or always? */}
                <div className="flex-1 max-w-xl mx-8">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-3 text-gray-700 bg-gray-100 border border-transparent rounded-3xl focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-200 text-sm outline-none transition"
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    {/* Pending Orders - Only for authenticated users */}
                    {isAuthenticated && (
                        <Link to="/orders" className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-2xl transition">
                            <span className="material-symbols-outlined text-2xl text-gray-600">receipt_long</span>
                            <span className="text-sm font-medium text-gray-700">Orders</span>
                            {pendingOrders > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {pendingOrders}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="relative flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Avatar with Hover Dropdown */}
                    <div className="relative group">
                        <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-105 transition">
                            {isAuthenticated ? getInitials() : 'G'}
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-5 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                        <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role}</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                                        <span className="material-symbols-outlined text-xl">person</span>
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                    <Link to="/orders" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                                        <span className="material-symbols-outlined text-xl">receipt_long</span>
                                        <span className="font-medium">My Orders</span>
                                    </Link>
                                    <div className="border-t my-2 mx-4"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-xl">logout</span>
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                                        <span className="material-symbols-outlined text-xl">login</span>
                                        <span className="font-medium">Login</span>
                                    </Link>
                                    <Link to="/register" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                                        <span className="material-symbols-outlined text-xl">app_registration</span>
                                        <span className="font-medium">Register</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SDHeader;