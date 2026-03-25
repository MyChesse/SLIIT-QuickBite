import toast from 'react-hot-toast';

const SDMenuItemCard = ({ item }) => {
    const handleAddToCart = () => {
        toast.success(`${item.name} added to cart!`);
        // You can later connect this to real cart logic
    };

    return (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all group">
            <div className="h-48 bg-gray-200 relative">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-orange-100 to-blue-100">
                        🍲
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                        Out of Stock
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                    <span className="text-xl font-bold text-blue-600">Rs. {item.price}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">{item.category}</p>

                {item.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.description}</p>
                )}

                <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm">
                        <span className="font-medium">Stock:</span> 
                        <span className={`ml-1 ${item.currentStock < item.lowStockThreshold ? 'text-red-600' : 'text-gray-700'}`}>
                            {item.currentStock}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!item.isAvailable || item.currentStock <= 0}
                        className={`px-6 py-2 text-sm font-medium rounded-2xl transition ${
                            item.isAvailable && item.currentStock > 0
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SDMenuItemCard;