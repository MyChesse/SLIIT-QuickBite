import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    promotionDate: {
      type: Date,
      required: true,
    },
    canteenName: {
      type: String,
      required: true,
      enum: ["New canteen", "Basement canteen", "Anohana Canteen"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Validation to ensure discounted price is less than original price
promotionSchema.pre("save", function (next) {
  if (this.discountedPrice >= this.originalPrice) {
    next(new Error("Discounted price must be less than original price"));
  } else {
    next();
  }
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
