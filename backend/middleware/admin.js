const db = require("../config/db");

const admin = (req, res, next) => {
    const sql = "SELECT isAdmin FROM users WHERE id = ?";
    db.query(sql, [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }
        if (!results[0].isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    });
};

module.exports = { admin };