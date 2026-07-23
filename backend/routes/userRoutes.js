const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getProfile, 
    adminRegister,
    getTotalUsers,
    getTotalRevenue,
    getAllUsers  // ✅ Import the user function
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/register", adminRegister);

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/total-users", protect, getTotalUsers);
router.get("/total-revenue", protect, getTotalRevenue);

// 🔒 Admin only - Get ALL users
router.get("/all", protect, admin, getAllUsers); // ✅ Users route (different file)

module.exports = router;