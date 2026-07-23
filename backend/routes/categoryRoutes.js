const express = require("express");
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// Public route (anyone can view categories)
router.get("/", getCategories);

// Admin only routes
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;