const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================================
// REGISTER CONTROLLER
// ============================================
const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password", error: err });
        }

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email already registered" });
                }
                return res.status(500).json({
                    message: "Error creating user",
                    error: err,
                });
            }

            res.status(201).json({
                message: "User registered successfully",
                userId: result.insertId,
                name: name,
                email: email
            });
        });
    });
};

// ============================================
// LOGIN CONTROLLER (UPDATED with isAdmin)
// ============================================
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: "Error comparing passwords", error: err });
            }

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || "my_super_secret_key_123",
                { expiresIn: "7d" }
            );

            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin || false
                }
            });
        });
    });
};

// ============================================
// ADMIN REGISTRATION
// ============================================
const adminRegister = (req, res) => {
    console.log("🔑 Secret key from .env:", process.env.ADMIN_SECRET_KEY);
    console.log("🔑 Secret key from form:", req.body.secretKey);
    const { name, email, password, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: "Invalid admin secret key" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error hashing password", error: err });
        }

        const sql = "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, true)";
        
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email already registered" });
                }
                console.error("❌ Admin Registration error:", err);
                return res.status(500).json({
                    message: "Error creating admin user",
                    error: err.message,
                });
            }

            res.status(201).json({
                message: "Admin registered successfully!",
                userId: result.insertId,
                name: name,
                email: email,
                isAdmin: true
            });
        });
    });
};

// ============================================
// PROFILE CONTROLLER
// ============================================
const getProfile = (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile!",
        user: req.user
    });
};

// ============================================
// GET TOTAL USERS (For Admin Dashboard)
// ============================================
const getTotalUsers = (req, res) => {
    const sql = "SELECT COUNT(*) as total FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error counting users", error: err });
        }
        const total = parseInt(results[0]?.total) || 0;
        res.status(200).json({ total: total });
    });
};

// ============================================
// GET TOTAL REVENUE (For Admin Dashboard)
// ============================================
const getTotalRevenue = (req, res) => {
    const sql = "SELECT SUM(total_price) as total FROM orders";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error calculating revenue", error: err });
        }
        const total = parseFloat(results[0]?.total) || 0;
        res.status(200).json({ total: total });
    });
};

// ============================================
// ============================================
// GET ALL USERS (Admin only) - FIXED
// ============================================
const getAllUsers = (req, res) => {
    // ✅ REMOVED 'created_at' because it doesn't exist in your users table
    const sql = "SELECT id, name, email, isAdmin FROM users ORDER BY id DESC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching all users:", err);
            return res.status(500).json({ message: "Error fetching users", error: err });
        }
        res.status(200).json(results);
    });
};
// ============================================
// ✅ EXPORT ALL (UPDATED with getAllUsers)
// ============================================
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    adminRegister,
    getTotalUsers,
    getTotalRevenue,
    getAllUsers, // ✅ ADDED!
};