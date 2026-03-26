import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import SDCanteenSelector from '../components/SDCanteenSelector';
import SDMenuItemCard from '../components/SDMenuItemCard';
import ramen from '../assets/ramen.jpg';

const SDMenuPage = () => {
    const { selectedCanteenId } = useContext(SDCanteenContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');

    const fetchMenuItems = async () => {
        if (!selectedCanteenId) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/inventory', {
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

    const filteredItems = categoryFilter === 'All' 
        ? items 
        : items.filter(item => item.category === categoryFilter);

    return (
        <div className="min-h-screen bg-white">
            {/* Modern Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="text-3xl font-black text-blue-600 tracking-tighter">
                            QuickBite
                        </span>
                        <SDCanteenSelector />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-3 hover:bg-gray-100 rounded-full transition">
                            <span className="material-symbols-outlined text-2xl text-gray-600">notifications</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                        </button>

                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span>Cart (2)</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-12 px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="relative h-[460px] rounded-3xl overflow-hidden mb-16 shadow-xl">
                    <img 
                        src={ramen}
                        alt="Today's Special" 
                        className="w-full h-full object-cover"
                    />
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
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Floating Wait Time Badge */}
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

            {/* Footer */}
            <footer className="bg-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-8 text-center text-gray-500 text-sm">
                    <p>© 2026 SLIIT QuickBite - University Canteen Management System</p>
                    <p className="mt-2">Made for IT3040 - ITPM Project | Semester 1</p>
                </div>
            </footer>
        </div>
    );
};

export default SDMenuPage;