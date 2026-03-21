import { useState, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import toast from 'react-hot-toast';

const SDAddItemForm = () => {
    const { selectedCanteenId } = useContext(SDCanteenContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Short Eats',
        description: '',
        currentStock: 50,
        lowStockThreshold: 10
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedCanteenId) {
            return toast.error("Please select a canteen first!");
        }

        setLoading(true);
        
        try {
            await axios.post('http://localhost:5001/api/inventory', formData, {
                headers: {
                    'x-canteen-id': selectedCanteenId
                }
            });

            toast.success('✅ Food item added successfully!');
            
            // Reset form
            setFormData({
                name: '',
                price: '',
                category: 'Short Eats',
                description: '',
                currentStock: 50,
                lowStockThreshold: 10
            });
            
            // Trigger refresh in parent (will add later)
            window.dispatchEvent(new Event('inventoryUpdated'));
            
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Food Item</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Chicken Kottu"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                        <input 
                            type="number" 
                            placeholder="450"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value="Short Eats">🍢 Short Eats</option>
                            <option value="Rice & Curry">🍛 Rice & Curry</option>
                            <option value="Beverages">🥤 Beverages</option>
                            <option value="Desserts">🍰 Desserts</option>
                            <option value="Other">🍽️ Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                        <input 
                            type="number"
                            value={formData.currentStock}
                            onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                        <input 
                            type="number"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        placeholder="e.g., Spicy chicken kottu with egg and vegetables"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows="2"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-medium text-white transition ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Adding...' : '➕ Add to Canteen'}
                </button>
            </form>
        </div>
    );
};

export default SDAddItemForm;