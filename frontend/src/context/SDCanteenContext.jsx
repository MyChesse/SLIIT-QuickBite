import { createContext, useState, useEffect } from 'react';


export const SDCanteenContext = createContext();

export const SDCanteenProvider = ({ children }) => {
    // Load selected canteen from localStorage (so it remembers after refresh)
    const [selectedCanteenId, setSelectedCanteenId] = useState(() => {
        return localStorage.getItem('selectedCanteenId') || '';
    });

    const [canteens, setCanteens] = useState([]); // Will store all 3 canteens

    // Save to localStorage whenever canteen changes
    useEffect(() => {
        if (selectedCanteenId) {
            localStorage.setItem('selectedCanteenId', selectedCanteenId);
        }
    }, [selectedCanteenId]);

    // Function to change canteen
    const selectCanteen = (canteenId) => {
        setSelectedCanteenId(canteenId);
    };

    // Function to clear selection
    const clearCanteen = () => {
        setSelectedCanteenId('');
        localStorage.removeItem('selectedCanteenId');
    };

    return (
        <SDCanteenContext.Provider value={{
            selectedCanteenId,
            selectCanteen,
            clearCanteen,
            canteens,
            setCanteens
        }}>
            {children}
        </SDCanteenContext.Provider>
    );
};
