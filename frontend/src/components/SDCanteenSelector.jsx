import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SDCanteenContext } from '../context/SDCanteenContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SDCanteenSelector = () => {
    const { selectedCanteenId, selectCanteen, canteens, setCanteens } = useContext(SDCanteenContext);
    const { user, isStaff, isAdmin } = useAuth();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/canteens');
                let allCanteens = res.data.data || res.data;

                // Staff restriction: Only show assigned canteens
                if (isStaff && user?.assignedCanteens) {
                    allCanteens = allCanteens.filter(canteen =>
                        user.assignedCanteens.some(assignedId => 
                            assignedId.toString() === canteen._id.toString()
                        )
                    );
                }

                // Admin sees everything
                // Students / Guests see everything

                setCanteens(allCanteens);
            } catch (error) {
                console.error("Failed to load canteens", error);
                toast.error("Could not load canteens");
            } finally {
                setLoading(false);
            }
        };

        fetchCanteens();
    }, [setCanteens, isStaff, user]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-500 font-medium">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-2 hover:shadow-md transition-all">
            <span className="text-orange-500 text-xl">🍽️</span>

            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Current Canteen
            </span>

            <select
                value={selectedCanteenId || ''}
                onChange={(e) => selectCanteen(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-800 font-medium cursor-pointer 
                           border border-gray-300 rounded-xl px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
                <option value="">Select Canteen</option>
                {canteens.map(canteen => (
                    <option key={canteen._id} value={canteen._id}>
                        🍽️ {canteen.name} • {canteen.location}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SDCanteenSelector;
