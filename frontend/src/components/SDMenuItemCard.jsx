import { useState } from 'react';
import toast from 'react-hot-toast';

const SDMenuItemCard = ({ item }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!item.isAvailable || item.currentStock <= 0) {
            toast.error("This item is currently unavailable");
            return;
        }

        setIsAdded(true);
        toast.success(`${item.name} added to cart!`);

        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                    <img 
                        src={`http://localhost:5001${item.imageUrl}`}   // ← Important: Add backend URL
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-orange-50 to-blue-50">
                        🍲
                    </div>
                )}

                {/* Stock Status Badge */}
                {!item.isAvailable && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                        OUT OF STOCK
                    </div>
                )}

                {item.isAvailable && item.currentStock < item.lowStockThreshold && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                        LOW STOCK
                    </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                    <span className="text-xs font-bold text-gray-700">4.8</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2 flex-1">
                        {item.name}
                    </h3>
                    <span className="font-bold text-2xl text-blue-600 ml-3">
                        Rs. {item.price}
                    </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                    <span className="inline-block px-4 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-3xl">
                        {item.category}
                    </span>
                    
                    <span className={`text-xs font-medium px-3 py-1 rounded-3xl ${
                        item.currentStock < item.lowStockThreshold 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {item.currentStock} left
                    </span>
                </div>

                {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                        {item.description}
                    </p>
                )}

                {/* Add to Cart Button */}
                <button 
                    onClick={handleAddToCart}
                    disabled={!item.isAvailable || item.currentStock <= 0}
                    className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                        item.isAvailable && item.currentStock > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <span className="material-symbols-outlined text-xl"></span>
                    {isAdded ? 'Added to Cart ' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default SDMenuItemCard;