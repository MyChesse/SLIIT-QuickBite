import { useState, useEffect, useContext } from 'react';
import { SDCanteenContext } from '../context/SDCanteenContext';
import SDMenuItemCard from '../components/SDMenuItemCard';
import ramen from '../assets/ramen.jpg';
import api from '../services/api';
import { feedbackAPI } from '../services/api';
import SDFooter from '../components/SDFooter';
import SDHeader from '../components/SDHeader';

const SDMenuPage = () => {
    const { selectedCanteenId, canteens } = useContext(SDCanteenContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [feedbackList, setFeedbackList] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');

    const selectedCanteen = canteens.find(canteen => canteen._id === selectedCanteenId);
    const selectedCanteenName = selectedCanteen?.name || '';

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

    const fetchFeedback = async () => {
        setFeedbackLoading(true);
        setFeedbackError('');
        try {
            const response = await feedbackAPI.getAllFeedback();
            setFeedbackList(response.data || []);
        } catch (error) {
            console.error(error);
            setFeedbackError('Failed to load feedback');
        } finally {
            setFeedbackLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [selectedCanteenId]);

    useEffect(() => {
        fetchFeedback();
    }, []);

    // Live search + category filter
    const filteredItems = items
        .filter(item => categoryFilter === 'All' || item.category === categoryFilter)
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const visibleFeedback = selectedCanteenName
        ? feedbackList.filter(feedback =>
            feedback.canteen?.trim().toLowerCase() === selectedCanteenName.trim().toLowerCase()
        )
        : feedbackList;

    const getFeedbackCanteenLabel = (canteen) => {
        const normalizedCanteen = canteen?.trim();

        if (!normalizedCanteen || normalizedCanteen === 'Choose the Canteen' || normalizedCanteen === 'Select Canteen') {
            return 'Unknown Canteen';
        }

        return normalizedCanteen;
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-sm ${index < rating ? 'text-amber-400' : 'text-slate-300'}`}
            >
                ★
            </span>
        ));
    };

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

                {/* User Feedback Section */}
                <section className="mt-20">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Community Voice</p>
                            <h2 className="mt-2 text-3xl font-black text-slate-900">What students are saying</h2>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                {selectedCanteenName
                                    ? `Showing feedback for ${selectedCanteenName}.`
                                    : 'Showing feedback from all canteens.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter</p>
                            <p className="text-sm font-semibold text-slate-800">
                                {selectedCanteenName || 'All Canteens'}
                            </p>
                        </div>
                    </div>

                    {feedbackLoading ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
                            Loading feedback...
                        </div>
                    ) : feedbackError ? (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                            {feedbackError}
                        </div>
                    ) : visibleFeedback.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
                            No feedback available for this canteen yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {visibleFeedback.map((feedback) => (
                                <article
                                    key={feedback._id}
                                    className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(0,86,210,0.22)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">{feedback.name}</p>
                                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                <span className="material-symbols-outlined text-[16px] text-blue-600">restaurant</span>
                                                Canteen: {getFeedbackCanteenLabel(feedback.canteen)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 rounded-full bg-amber-50 px-3 py-1">
                                            {renderStars(feedback.rating)}
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                        <p className="break-words text-sm leading-relaxed text-slate-700 line-clamp-5">
                                            {feedback.message}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                                            {feedback.feedbackType}
                                        </span>
                                        <span>{feedback.userType}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Advanced Footer */}
            <SDFooter />
        </div>
    );
};

export default SDMenuPage;