import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "quickbite-dev-secret";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      name,
      id,
      email,
      password,
      confirmPassword,
      userType,
      terms,
      assignedCanteens,
    } = req.body;

    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedUserId = typeof id === "string" ? id.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedUserType =
      typeof userType === "string" ? userType.trim().toLowerCase() : "";
    const acceptedTerms = terms === true || terms === "true" || terms === "on";
    const normalizedAssignedCanteens = Array.isArray(assignedCanteens)
      ? assignedCanteens.filter(Boolean)
      : [];

    if (
      !normalizedName ||
      !normalizedUserId ||
      !normalizedEmail ||
      !password ||
      !confirmPassword ||
      !normalizedUserType ||
      !acceptedTerms
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!["student", "staff"].includes(normalizedUserType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (normalizedUserType === "staff") {
      if (normalizedAssignedCanteens.length === 0) {
        return res.status(400).json({
          message: "Staff members must be assigned to at least one canteen",
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { userId: normalizedUserId }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: normalizedName,
      userId: normalizedUserId,
      email: normalizedEmail,
      password,
      role: normalizedUserType,
      assignedCanteens:
        normalizedUserType === "staff" ? normalizedAssignedCanteens : [],
      status: "active",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedCanteens: user.assignedCanteens,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedCanteens: user.assignedCanteens || [], // ← Important for staff
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedCanteens: user.assignedCanteens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
