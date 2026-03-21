import SDAddItemForm from '../components/SDAddItemForm';
import SDInventoryTable from '../components/SDInventoryTable';
import SDCanteenSelector from '../components/SDCanteenSelector';

const SDInventoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Canteen Selector */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">🍽️ Inventory Management</h1>
                        <p className="text-sm text-gray-500">Manage food items for your canteen</p>
                    </div>
                    <SDCanteenSelector />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add New Item Form */}
                    <div>
                        <SDAddItemForm />
                    </div>

                    {/* Inventory Table */}
                    <div>
                        <SDInventoryTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SDInventoryPage;