const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getMyOrders, getAllOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// Protected routes (logged-in users)
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin only - Get ALL orders from ALL users
router.get("/all", protect, admin, getAllOrders);

module.exports = router;