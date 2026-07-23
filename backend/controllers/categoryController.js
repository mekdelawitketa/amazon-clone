const db = require("../config/db");

const getCategories = (req, res) => {
    db.query("SELECT * FROM categories ORDER BY name", (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching categories", error: err });
        res.status(200).json(results);
    });
};

const createCategory = (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });
    
    db.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description || null], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Category already exists" });
            return res.status(500).json({ message: "Error creating category", error: err });
        }
        res.status(201).json({ message: "Category created", categoryId: result.insertId });
    });
};

const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });
    
    db.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [name, description || null, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Category already exists" });
            return res.status(500).json({ message: "Error updating category", error: err });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated" });
    });
};

const deleteCategory = (req, res) => {
    const { id } = req.params;
    
    db.query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error checking category usage", error: err });
        if (results[0].count > 0) {
            return res.status(400).json({ message: `Cannot delete: used by ${results[0].count} product(s)` });
        }
        
        db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ message: "Error deleting category", error: err });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
            res.status(200).json({ message: "Category deleted" });
        });
    });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };