import SDAddItemForm from '../components/SDAddItemForm';
import SDInventoryTable from '../components/SDInventoryTable';
import SDStaffSidebar from '../components/SDStaffSidebar';
import SDCanteenSelector from '../components/SDCanteenSelector';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import { useAuth } from '../context/AuthContext';        // ← Added
import toast from 'react-hot-toast';
import api from '../services/api';

const SDInventoryPage = () => {
    const { selectedCanteenId, selectCanteen } = useContext(SDCanteenContext);
    const { user, isStaff, isAdmin } = useAuth();        // ← Added

    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        totalStockValue: 0
    });

    // Staff can only see their assigned canteens
    const allowedCanteens = isAdmin 
        ? [] // Admin sees all
        : user?.assignedCanteens || [];

    // Fetch statistics
    const fetchStats = async () => {
    if (!selectedCanteenId) return;
    
    try {
        const res = await api.get('http://localhost:5001/api/inventory', {
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

    // If staff has no assigned canteen
    if (isStaff && allowedCanteens.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-50 items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Canteen Assigned</h2>
                    <p className="text-gray-600">Your account is not assigned to any canteen yet.</p>
                    <p className="text-gray-500 text-sm mt-4">Please contact the administrator.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
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
                                    {isAdmin ? "Managing all canteens" : "Managing your assigned canteen"}
                                </p>
                            </div>
                        </div>
                        <SDCanteenSelector />
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="max-w-7xl mx-auto px-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-4xl">📦</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">TOTAL ITEMS</p>
                                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalItems}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 border-l-4 border-orange-500">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-4xl">⚠️</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">LOW STOCK</p>
                                <p className="text-4xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5 border-l-4 border-red-500">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-4xl">⛔</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">OUT OF STOCK</p>
                                <p className="text-4xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow p-6 flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl">💰</div>
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
                        <div className="lg:col-span-5">
                            <SDAddItemForm />
                        </div>
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
