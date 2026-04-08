import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import SDCanteenSelector from '../components/SDCanteenSelector';
import SDMenuItemCard from '../components/SDMenuItemCard';
import ramen from '../assets/ramen.jpg';
import api from '../services/api';

const SDMenuPage = () => {
    const { selectedCanteenId } = useContext(SDCanteenContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartCount] = useState(2);           // ← Change later when you add real cart
    const [pendingOrders] = useState(1);       // ← Demo pending orders count

    const fetchMenuItems = async () => {
        if (!selectedCanteenId) return;
        setLoading(true);
        try {
            const res = await api.get('http://localhost:5001/api/inventory', {
                headers: { 'x-canteen-id': selectedCanteenId }
            });
            setItems(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [selectedCanteenId]);

    // Live search + category filter
    const filteredItems = items
        .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400">
            {/* Advanced Navbar */}
            
<nav className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
    <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Left - Brand + Canteen Selector */}
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-blue-600 tracking-tighter">QuickBite</span>
                <span className="material-symbols-outlined text-2xl text-blue-600">restaurant_menu</span>
            </div>
            <SDCanteenSelector />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black text-xl">search</span>
                <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-5 py-3 text-black bg-gray-100 border border-transparent rounded-3xl focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-200 text-sm outline-none transition"
                />
            </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
            {/* Pending Orders */}
            <button className="relative flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-black rounded-2xl transition">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                <span className="text-sm font-medium">Orders</span>
                {pendingOrders > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {pendingOrders}
                    </span>
                )}
            </button>

            {/* Cart */}
            <button className="relative flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                <span>Cart</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </button>

            {/* User Avatar with Hover Dropdown + Mini Logos */}
            <div className="relative group">
                <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-105 transition">
                    JD
                </button>

                {/* Dropdown Menu with Mini Logos */}
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                        <span className="material-symbols-outlined text-xl">home</span>
                        <span className="font-medium">Home</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                        <span className="material-symbols-outlined text-xl">shopping_cart</span>
                        <span className="font-medium">My Orders</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                        <span className="material-symbols-outlined text-xl">person</span>
                        <span className="font-medium">Profile</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-700">
                        <span className="material-symbols-outlined text-xl">support_agent</span>
                        <span className="font-medium">Services</span>
                    </a>
                    <div className="border-t my-2 mx-4"></div>
                    <button className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</nav>

            <main className="pt-28 pb-12 px-8 max-w-7xl mx-auto">
                {/* Hero */}
                <section className="relative h-[460px] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <img src={ramen} alt="Today's Special" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                    <div className="absolute inset-0 flex items-center px-12">
                        <div className="max-w-xl text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-medium mb-6">
                                <span className="material-symbols-outlined">star</span>
                                TODAY'S SPECIAL
                            </div>
                            <h1 className="text-6xl font-black leading-tight mb-6">
                                Sri Lankan Spiced<br /> Ramen Noodles
                            </h1>
                            <p className="text-lg text-white/90 mb-8 max-w-md">
                                Skip the queue! Pre-order our chef's special and enjoy a free drink on us.
                            </p>
                            <button className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3">
                                Order Now — Rs. 850
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
                        <span className="material-symbols-outlined text-orange-500 text-4xl">timer</span>
                        <div>
                            <p className="text-xs font-medium text-gray-500">ESTIMATED WAIT</p>
                            <p className="text-3xl font-bold text-gray-900">12 MIN</p>
                        </div>
                    </div>
                </section>

                {/* Category Filters */}
                <div className="flex gap-3 mb-10 flex-wrap">
                    {['All', 'Short Eats', 'Rice & Curry', 'Beverages', 'Desserts'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-8 py-3 rounded-3xl font-semibold transition-all text-sm ${
                                categoryFilter === cat 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.map(item => (
                        <SDMenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            </main>

            {/* Advanced Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div>
                        <span className="text-2xl font-black text-white tracking-tighter">QuickBite</span>
                        <p className="mt-3 text-sm text-gray-400">
                            Smart canteen ordering for SLIIT students. Skip the queue, save time.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium mb-4 text-white">Quick Links</p>
                        <div className="space-y-2 text-sm">
                            <p>Home</p>
                            <p>My Orders</p>
                            <p>Menu</p>
                            <p>Feedback</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium mb-4 text-white">Canteens</p>
                        <div className="space-y-2 text-sm">
                            <p>Main Canteen  - 0112573912</p>
                            <p>Mini Canteen  - 0112973913</p>
                            <p>New Canteen  - 0112513914</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium mb-4 text-white">Contact</p>
                        <p className="text-sm">+94 11 234 5678</p>
                        <p className="text-sm">quickbite@sliit.lk</p>
                      {/* Social Media Icons - Fixed with SVG */}
                    <div className="flex gap-6 mt-6">
                            {/* Facebook */}
                            <a href="#" className="text-blue-400 hover:text-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a href="#" className="text-pink-400 hover:text-pink-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.255-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 4.775.2 2.8 2.175 2.672 4.453.014 5.733 0 6.14 0 12s.014 6.268.072 7.447c.128 2.278 2.103 4.253 4.381 4.381 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c2.278-.128 4.253-2.103 4.381-4.381.058-1.28.072-1.688.072-7.447s-.014-6.268-.072-7.447c-.128-2.278-2.103-4.253-4.381-4.381C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                                </svg>
                            </a>

                            {/* X / Twitter */}
                            <a href="#" className="text-white hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.796-7.57-6.638 7.57H.474l8.6-9.82L0 1.153h7.74l5.345 7.07L18.901 1.153z"/>
                                </svg>
                            </a>
                    </div>
                    </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-16 border-t border-gray-800 pt-8">
                    © 2026 SLIIT QuickBite • IT3040 ITPM Semester Project
                </div>
            </footer>
        </div>
    );
};

export default SDMenuPage;