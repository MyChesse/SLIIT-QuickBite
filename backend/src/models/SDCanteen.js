import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Canteen = mongoose.model("Canteen", canteenSchema);
export default Canteen;