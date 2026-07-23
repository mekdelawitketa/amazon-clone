const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

console.log("✅ Product routes loaded");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post("/", protect, admin, upload.single('image'), createProduct);
router.put("/:id", protect, admin, upload.single('image'), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;