import Promotion from "../models/Promotion.js";

// Get all promotions
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get promotions by canteen
export const getPromotionsByCanteen = async (req, res) => {
  try {
    const { canteenName } = req.params;
    const promotions = await Promotion.find({ canteenName }).sort({
      createdAt: -1,
    });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get today's promotions
export const getTodaysPromotions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const promotions = await Promotion.find({
      promotionDate: {
        $gte: today,
        $lt: tomorrow,
      },
      isAvailable: true,
    }).sort({ canteenName: 1, createdAt: -1 });

    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new promotion
export const addPromotion = async (req, res) => {
  try {
    const {
      title,
      description,
      originalPrice,
      discountedPrice,
      promotionDate,
      canteenName,
      isAvailable,
      image,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !originalPrice ||
      !discountedPrice ||
      !promotionDate ||
      !canteenName
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (originalPrice <= 0 || discountedPrice <= 0) {
      return res.status(400).json({ message: "Prices must be greater than 0" });
    }

    if (discountedPrice >= originalPrice) {
      return res
        .status(400)
        .json({ message: "Discounted price must be less than original price" });
    }

    const validCanteens = [
      "New canteen",
      "Basement canteen",
      "Anohana Canteen",
    ];
    if (!validCanteens.includes(canteenName)) {
      return res.status(400).json({ message: "Invalid canteen name" });
    }

    // Validate promotion date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const promoDate = new Date(promotionDate);
    if (promoDate < today) {
      return res
        .status(400)
        .json({ message: "Promotion date cannot be in the past" });
    }

    const newPromotion = new Promotion({
      title,
      description,
      originalPrice,
      discountedPrice,
      promotionDate: promoDate,
      canteenName,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image,
    });

    const savedPromotion = await newPromotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// Update a promotion (optional)
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating canteenName if it's not allowed
    delete updates.canteenName;

    // Validate promotion date if it's being updated
    if (updates.promotionDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const promoDate = new Date(updates.promotionDate);
      if (promoDate < today) {
        return res
          .status(400)
          .json({ message: "Promotion date cannot be in the past" });
      }
      updates.promotionDate = promoDate;
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a promotion (optional)
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPromotion = await Promotion.findByIdAndDelete(id);
    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
