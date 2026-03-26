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
        lowStockThreshold: 10,
        imageFile: null,
        imagePreview: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedCanteenId) {
            return toast.error("Please select a canteen first!");
        }

        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('currentStock', formData.currentStock);
        data.append('lowStockThreshold', formData.lowStockThreshold);
        
        if (formData.imageFile) data.append('image', formData.imageFile);

        try {
            await axios.post('http://localhost:5001/api/inventory', data, {
                headers: {
                    'x-canteen-id': selectedCanteenId,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('✅ Food item added successfully!');
            setFormData({ name: '', price: '', category: 'Short Eats', description: '', currentStock: 50, lowStockThreshold: 10, imageFile: null, imagePreview: null });
            window.dispatchEvent(new Event('inventoryUpdated'));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add New Food Item</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Name *</label>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="e.g., Chicken Kottu"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required 
                    />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (Rs.) *</label>
                        <input 
                            type="number" 
                            name="price"
                            placeholder="450"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full p-4 border border-gray-200 rounded-2xl"
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-4 border border-gray-200 rounded-2xl"
                        >
                            <option value="Short Eats">Short Eats</option>
                            <option value="Rice & Curry">Rice & Curry</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Stock</label>
                        <input 
                            type="number"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                            className="w-full p-4 border border-gray-200 rounded-2xl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert</label>
                        <input 
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value) || 10})}
                            className="w-full p-4 border border-gray-200 rounded-2xl"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea 
                        name="description"
                        placeholder="e.g., Spicy chicken kottu with egg and vegetables"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows="3"
                        className="w-full p-4 border border-gray-200 rounded-2xl"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Image</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setFormData(prev => ({
                                    ...prev,
                                    imageFile: file,
                                    imagePreview: URL.createObjectURL(file)
                                }));
                            }
                        }}
                        className="w-full p-3 border border-gray-200 rounded-2xl file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                    />
                    {formData.imagePreview && (
                        <div className="mt-4 rounded-2xl overflow-hidden border">
                            <img src={formData.imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-semibold text-white transition-all text-lg shadow-md ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                    }`}
                >
                    {loading ? 'Adding Item...' : '➕ Add to Canteen'}
                </button>
            </form>
        </div>
    );
};

export default SDAddItemForm;