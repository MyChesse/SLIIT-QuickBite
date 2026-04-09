import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import SDCanteenSelector from '../components/SDCanteenSelector';
import SDMenuItemCard from '../components/SDMenuItemCard';
import ramen from '../assets/ramen.jpg';
import api from '../services/api';
import SDFooter from '../components/SDFooter';
import SDHeader from '../components/SDHeader';

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
            
     <SDHeader />

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
            <SDFooter />
        </div>
    );
};

export default SDMenuPage;