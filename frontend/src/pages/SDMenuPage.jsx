import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import SDMenuItemCard from '../components/SDMenuItemCard';
import SDCanteenSelector from '../components/SDCanteenSelector';

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
            console.error("Failed to load menu", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [selectedCanteenId]);

    // Filter items by category
    const filteredItems = categoryFilter === 'All' 
        ? items 
        : items.filter(item => item.category === categoryFilter);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">🍽️ Menu</h1>
                    <SDCanteenSelector />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Category Filter */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    <button 
                        onClick={() => setCategoryFilter('All')}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium transition ${
                            categoryFilter === 'All' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white hover:bg-gray-100 border'
                        }`}
                    >
                        All Items
                    </button>
                    <button 
                        onClick={() => setCategoryFilter('Short Eats')}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium transition ${
                            categoryFilter === 'Short Eats' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white hover:bg-gray-100 border'
                        }`}
                    >
                        Short Eats
                    </button>
                    <button 
                        onClick={() => setCategoryFilter('Rice & Curry')}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium transition ${
                            categoryFilter === 'Rice & Curry' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white hover:bg-gray-100 border'
                        }`}
                    >
                        Rice & Curry
                    </button>
                    <button 
                        onClick={() => setCategoryFilter('Beverages')}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium transition ${
                            categoryFilter === 'Beverages' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white hover:bg-gray-100 border'
                        }`}
                    >
                        Beverages
                    </button>
                    <button 
                        onClick={() => setCategoryFilter('Desserts')}
                        className={`px-5 py-2 rounded-3xl text-sm font-medium transition ${
                            categoryFilter === 'Desserts' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white hover:bg-gray-100 border'
                        }`}
                    >
                        Desserts
                    </button>
                </div>

                {/* Menu Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <SDMenuItemCard key={item._id} item={item} />
                        ))}
                    </div>
                )}

                {filteredItems.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No items available in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SDMenuPage;