import SDAddItemForm from '../components/SDAddItemForm';
import SDInventoryTable from '../components/SDInventoryTable';
import SDStaffSidebar from '../components/SDStaffSidebar';
import SDCanteenSelector from '../components/SDCanteenSelector';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';

const SDInventoryPage = () => {
    const { selectedCanteenId } = useContext(SDCanteenContext);
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        totalStockValue: 0
    });

    // Fetch statistics
    const fetchStats = async () => {
        if (!selectedCanteenId) return;
        
        try {
            const res = await axios.get('http://localhost:5001/api/inventory', {
                headers: { 'x-canteen-id': selectedCanteenId }
            });
            
            const items = res.data.data || [];
            
            const totalItems = items.length;
            const lowStock = items.filter(item => item.currentStock < item.lowStockThreshold).length;
            const outOfStock = items.filter(item => item.currentStock === 0).length;
            const totalStockValue = items.reduce((sum, item) => sum + (item.price * item.currentStock), 0);

            setStats({
                totalItems,
                lowStock,
                outOfStock,
                totalStockValue: Math.round(totalStockValue)
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
        
        const handleUpdate = () => fetchStats();
        window.addEventListener('inventoryUpdated', handleUpdate);
        
        return () => window.removeEventListener('inventoryUpdated', handleUpdate);
    }, [selectedCanteenId]);

    return (
        <div className="flex min-h-screen bg-gray-200">
            {/* Sidebar */}
            <SDStaffSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                {/* Modern Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner">
                                📦
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    Inventory Management
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Manage food items and stock levels for your canteen
                                </p>
                            </div>
                        </div>
                        <SDCanteenSelector />
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Items */}
                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-4xl">
                                📦
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">TOTAL ITEMS</p>
                                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalItems}</p>
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 border-l-4 border-orange-500">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-4xl">
                                ⚠️
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">LOW STOCK</p>
                                <p className="text-4xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
                            </div>
                        </div>

                        {/* Out of Stock */}
                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 border-l-4 border-red-500">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-4xl">
                                ⛔
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">OUT OF STOCK</p>
                                <p className="text-4xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
                            </div>
                        </div>

                        {/* Stock Value */}
                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl">
                                💰
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">STOCK VALUE</p>
                                <p className="text-4xl font-bold text-emerald-600 mt-1">Rs. {stats.totalStockValue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Add New Item Form */}
                        <div className="lg:col-span-5">
                            <SDAddItemForm />
                        </div>

                        {/* Inventory Table */}
                        <div className="lg:col-span-7">
                            <SDInventoryTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SDInventoryPage;