import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import toast from 'react-hot-toast';

const SDInventoryTable = () => {
    const { selectedCanteenId } = useContext(SDCanteenContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchItems = async () => {
        if (!selectedCanteenId) return;
        
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/inventory', {
                headers: { 'x-canteen-id': selectedCanteenId }
            });
            setItems(res.data.data);
        } catch (error) {
            console.error("Failed to load inventory", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        
        // Listen for updates from AddItemForm
        const handleUpdate = () => fetchItems();
        window.addEventListener('inventoryUpdated', handleUpdate);
        return () => window.removeEventListener('inventoryUpdated', handleUpdate);
    }, [selectedCanteenId]);

    // Update Stock
    const updateStock = async (itemId, change) => {
        setUpdatingId(itemId);
        try {
            await axios.put(`http://localhost:5001/api/inventory/${itemId}/stock`, 
                { quantity: change },
                { headers: { 'x-canteen-id': selectedCanteenId } }
            );
            toast.success(`Stock updated`);
            fetchItems();
        } catch (error) {
            toast.error("Failed to update stock");
        } finally {
            setUpdatingId(null);
        }
    };

    // Toggle Availability
    const toggleAvailability = async (item) => {
        setUpdatingId(item._id);
        try {
            await axios.put(`http://localhost:5001/api/inventory/${item._id}/availability`,
                {},
                { headers: { 'x-canteen-id': selectedCanteenId } }
            );
            toast.success(`${item.name} is now ${!item.isAvailable ? 'Available' : 'Unavailable'}`);
            fetchItems();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete Item
    const deleteItem = async (item) => {
        if (!confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) return;
        
        setUpdatingId(item._id);
        try {
            await axios.delete(`http://localhost:5001/api/inventory/${item._id}`,
                { headers: { 'x-canteen-id': selectedCanteenId } }
            );
            toast.success(`${item.name} deleted successfully`);
            fetchItems();
        } catch (error) {
            toast.error("Failed to delete item");
        } finally {
            setUpdatingId(null);
        }
    };

    if (!selectedCanteenId) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">Please select a canteen from the dropdown above to view inventory.</p>
            </div>
        );
    }

    if (loading && items.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">📋 Current Inventory</h2>
                <p className="text-sm text-gray-500 mt-1">{items.length} items found</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">Food Name</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">Category</th>
                            <th className="p-4 text-center text-sm font-semibold text-gray-600">Price</th>
                            <th className="p-4 text-center text-sm font-semibold text-gray-600">Stock</th>
                            <th className="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map(item => {
                            const isLowStock = item.currentStock < item.lowStockThreshold;
                            const isUpdating = updatingId === item._id;
                            
                            return (
                                <tr key={item._id} className={`hover:bg-gray-50 transition ${isLowStock ? 'bg-red-50' : ''}`}>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            {item.description && (
                                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-medium">Rs. {item.price}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateStock(item._id, -1)}
                                                disabled={isUpdating || item.currentStock <= 0}
                                                className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition"
                                            >
                                                -
                                            </button>
                                            <span className={`font-bold w-12 text-center ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                {item.currentStock}
                                            </span>
                                            <button
                                                onClick={() => updateStock(item._id, 1)}
                                                disabled={isUpdating}
                                                className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                                            >
                                                +
                                            </button>
                                            {isLowStock && (
                                                <span className="text-xs text-red-600 font-semibold ml-1">LOW</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleAvailability(item)}
                                            disabled={isUpdating}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                                item.isAvailable 
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => deleteItem(item)}
                                            disabled={isUpdating}
                                            className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                                            title="Delete item"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No items found. Add your first food item using the form!
                    </div>
                )}
            </div>
        </div>
    );
};

export default SDInventoryTable;