import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    canteenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canteen",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ["Short Eats", "Rice & Curry", "Beverages", "Desserts", "Other"]
    },
    description: String,
    imageUrl: String,
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentStock: {
        type: Number,
        default: 50,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    }
}, {
    timestamps: true
});

// Prevent duplicate food name in same canteen
menuItemSchema.index({ canteenId: 1, name: 1 }, { unique: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;