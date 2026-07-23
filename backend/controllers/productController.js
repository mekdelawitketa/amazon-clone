const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ============================================================
// GET ALL PRODUCTS (with category name)
// ============================================================
const getProducts = (req, res) => {
    const sql = `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching products:", err);
            return res.status(500).json({ message: "Error fetching products", error: err });
        }
        res.status(200).json(results);
    });
};

// ============================================================
// GET SINGLE PRODUCT BY ID
// ============================================================
const getProductById = (req, res) => {
    const productId = req.params.id;
    const sql = `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;
    db.query(sql, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(results[0]);
    });
};

// ============================================================
// CREATE PRODUCT (with category_id)
// ============================================================
const createProduct = (req, res) => {
    console.log("📝 ===== CREATE PRODUCT REQUEST =====");
    console.log("📦 Body:", req.body);
    console.log("🖼️ File:", req.file);
    console.log("👤 User:", req.user);

    const { name, price, description, category_id, countInStock } = req.body;
    
    // ✅ Validate required fields (category_id instead of category)
    if (!name || !price || !description || !category_id) {
        return res.status(400).json({ 
            message: "Please fill in all required fields",
            missing: { 
                name: !name, 
                price: !price, 
                description: !description, 
                category_id: !category_id 
            }
        });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!image) {
        return res.status(400).json({ message: "Product image is required" });
    }

    // ✅ SQL with category_id
    const sql = `INSERT INTO products (name, price, image, description, category_id, countInStock) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [name, price, image, description, category_id, countInStock || 0], (err, result) => {
        if (err) {
            console.error("❌ DB Error:", err);
            return res.status(500).json({ message: "Error creating product", error: err.message });
        }
        
        console.log("✅ Product created with ID:", result.insertId);
        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });
    });
};

// ============================================================
// UPDATE PRODUCT (with category_id)
// ============================================================
const updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, price, description, category_id, countInStock } = req.body;
    
    const getSql = "SELECT * FROM products WHERE id = ?";
    db.query(getSql, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        const currentProduct = results[0];
        let image = currentProduct.image;
        
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
            if (currentProduct.image && currentProduct.image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', currentProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }
            }
        }
        
        // ✅ SQL with category_id
        const sql = `UPDATE products SET name = ?, price = ?, image = ?, description = ?, category_id = ?, countInStock = ? WHERE id = ?`;
        db.query(sql, [name, price, image, description, category_id, countInStock || 0, productId], (err, result) => {
            if (err) {
                console.error("❌ Update error:", err);
                return res.status(500).json({ message: "Error updating product", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product updated successfully", productId: productId });
        });
    });
};

// ============================================================
// DELETE PRODUCT
// ============================================================
const deleteProduct = (req, res) => {
    const productId = req.params.id;
    const getSql = "SELECT image FROM products WHERE id = ?";
    db.query(getSql, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching product", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        const imagePath = results[0].image;
        const deleteSql = "DELETE FROM products WHERE id = ?";
        db.query(deleteSql, [productId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error deleting product", error: err });
            }
            if (imagePath && imagePath.startsWith('/uploads/')) {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlink(fullPath, (err) => {
                        if (err) console.error('Error deleting image:', err);
                    });
                }
            }
            res.status(200).json({ message: "Product deleted successfully" });
        });
    });
};

// ============================================================
// EXPORT ALL
// ============================================================
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};