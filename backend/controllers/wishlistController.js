const db = require("../config/db");

// ============================================
// GET USER'S WISHLIST
// ============================================
const getWishlist = (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT p.* 
        FROM products p 
        JOIN wishlist w ON p.id = w.product_id 
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching wishlist:", err);
            return res.status(500).json({ message: "Error fetching wishlist", error: err });
        }
        res.status(200).json(results);
    });
};

// ============================================
// ADD TO WISHLIST
// ============================================
const addToWishlist = (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Product already in wishlist" });
            }
            console.error("❌ Error adding to wishlist:", err);
            return res.status(500).json({ message: "Error adding to wishlist", error: err });
        }
        res.status(201).json({ message: "Added to wishlist", productId: productId });
    });
};

// ============================================
// REMOVE FROM WISHLIST
// ============================================
const removeFromWishlist = (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error("❌ Error removing from wishlist:", err);
            return res.status(500).json({ message: "Error removing from wishlist", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }
        res.status(200).json({ message: "Removed from wishlist" });
    });
};

// ============================================
// CHECK IF PRODUCT IS IN WISHLIST
// ============================================
const checkWishlist = (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const sql = "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?";
    db.query(sql, [userId, productId], (err, results) => {
        if (err) {
            console.error("❌ Error checking wishlist:", err);
            return res.status(500).json({ message: "Error checking wishlist", error: err });
        }
        res.status(200).json({ inWishlist: results.length > 0 });
    });
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
};