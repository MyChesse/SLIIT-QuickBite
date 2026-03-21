import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';

const SDCanteenSelector = () => {
    const { selectedCanteenId, selectCanteen, canteens, setCanteens } = useContext(SDCanteenContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/canteens');
                setCanteens(res.data.data || res.data);
            } catch (error) {
                console.error("Failed to load canteens", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCanteens();
    }, [setCanteens]);

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500">Loading canteens...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">📍 Canteen:</span>
            <select
                value={selectedCanteenId}
                onChange={(e) => selectCanteen(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
                <option value="">Select a canteen</option>
                {canteens.map(canteen => (
                    <option key={canteen._id} value={canteen._id}>
                        🍽️ {canteen.name} ({canteen.location})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SDCanteenSelector;