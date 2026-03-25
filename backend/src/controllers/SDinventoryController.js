import MenuItem from "../models/SDMenuItem.js";

// Add new food item with clean validation error handling
export async function addFoodItem(req, res) {
    try {
        const { name, price, category, description, imageUrl, currentStock, lowStockThreshold } = req.body;

        const newItem = new MenuItem({
            canteenId: req.canteenId,
            name,
            price,
            category,
            description,
            imageUrl,
            currentStock: currentStock || 50,
            lowStockThreshold: lowStockThreshold || 10
        });

        const savedItem = await newItem.save();

        res.status(201).json({ 
            success: true, 
            message: "Food item added successfully",
            data: savedItem 
        });

    } catch (error) {
        console.error("Error in addFoodItem:", error);

        // Handle Mongoose Validation Errors
        if (error.name === "ValidationError") {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        // Handle duplicate key error (same food name in same canteen)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Food item with this name already exists in this canteen"
            });
        }

        // Other errors
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

// Get all food items
export async function getFoodItems(req, res) {
    try {
        const items = await MenuItem.find({ canteenId: req.canteenId })
            .sort({ category: 1, name: 1 });
        
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        console.error("Error in getFoodItems:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update stock + Low Stock Alert
export async function updateStock(req, res) {
    try {
        const { quantity } = req.body;

        const item = await MenuItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: "Item not found" });
        if (item.canteenId.toString() !== req.canteenId) {
            return res.status(403).json({ message: "Not authorized for this canteen" });
        }

        const oldStock = item.currentStock;
        item.currentStock += quantity;
        if (item.currentStock < 0) item.currentStock = 0;

        await item.save();

        if (item.currentStock < item.lowStockThreshold && oldStock >= item.lowStockThreshold) {
            console.log(`🚨 LOW STOCK ALERT: ${item.name} has only ${item.currentStock} left!`);
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: item
        });
    } catch (error) {
        console.error("Error in updateStock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Toggle availability
export async function toggleAvailability(req, res) {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: "Item not found" });
        if (item.canteenId.toString() !== req.canteenId) {
            return res.status(403).json({ message: "Not authorized for this canteen" });
        }

        item.isAvailable = !item.isAvailable;
        await item.save();

        res.status(200).json({
            success: true,
            message: `Item is now ${item.isAvailable ? 'Available' : 'Unavailable'}`,
            data: item
        });
    } catch (error) {
        console.error("Error in toggleAvailability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete item
export async function deleteFoodItem(req, res) {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) return res.status(404).json({ message: "Item not found" });
        if (item.canteenId.toString() !== req.canteenId) {
            return res.status(403).json({ message: "Not authorized for this canteen" });
        }

        await MenuItem.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Food item deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteFoodItem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}