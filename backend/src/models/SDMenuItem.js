import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    canteenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Canteen",
        required: [true, "Canteen ID is required"]
    },
    name: {
        type: String,
        required: [true, "Food name is required"],
        trim: true,
        minlength: [2, "Food name must be at least 2 characters"],
        maxlength: [100, "Food name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: ["Short Eats", "Rice & Curry", "Beverages", "Desserts", "Other"],
            message: "Category must be one of: Short Eats, Rice & Curry, Beverages, Desserts, Other"
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    imageUrl: {
        type: String,
        default: ""
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentStock: {
        type: Number,
        default: 50,
        min: [0, "Stock cannot be negative"]
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: [1, "Low stock threshold must be at least 1"]
    }
}, {
    timestamps: true
});

// Prevent duplicate food name in the same canteen
menuItemSchema.index({ canteenId: 1, name: 1 }, { unique: true });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;