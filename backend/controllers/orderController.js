const db = require("../config/db");

// ============================================
// CREATE ORDER
// ============================================
const createOrder = (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "No order items provided" });
    }
    if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required" });
    }
    if (!paymentMethod) {
        return res.status(400).json({ message: "Payment method is required" });
    }

    let totalPrice = 0;
    orderItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    const orderSql = `INSERT INTO orders (user_id, total_price, shipping_address, payment_method) 
                      VALUES (?, ?, ?, ?)`;
    
    db.query(orderSql, [userId, totalPrice, shippingAddress, paymentMethod], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error creating order", error: err });
        }

        const orderId = result.insertId;

        const itemSql = `INSERT INTO order_items (order_id, product_id, name, price, quantity, image) 
                         VALUES ?`;

        const values = orderItems.map(item => [
            orderId,
            item.product_id,
            item.name,
            item.price,
            item.quantity,
            item.image
        ]);

        db.query(itemSql, [values], (err, result) => {
            if (err) {
                db.query("DELETE FROM orders WHERE id = ?", [orderId]);
                return res.status(500).json({ message: "Error saving order items", error: err });
            }

            const stockUpdateQueries = orderItems.map(item => {
                return new Promise((resolve, reject) => {
                    const updateSql = "UPDATE products SET countInStock = countInStock - ? WHERE id = ?";
                    db.query(updateSql, [item.quantity, item.product_id], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            });

            Promise.all(stockUpdateQueries)
                .then(() => {
                    res.status(201).json({
                        message: "Order created successfully",
                        orderId: orderId,
                        totalPrice: totalPrice
                    });
                })
                .catch((err) => {
                    console.error("Error updating stock:", err);
                    res.status(201).json({
                        message: "Order created but stock update failed.",
                        orderId: orderId
                    });
                });
        });
    });
};

// ============================================
// GET ORDER BY ID
// ============================================
const getOrderById = (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    const orderSql = "SELECT * FROM orders WHERE id = ? AND user_id = ?";
    db.query(orderSql, [orderId, userId], (err, orderResults) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching order", error: err });
        }

        if (orderResults.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = orderResults[0];

        const itemsSql = "SELECT * FROM order_items WHERE order_id = ?";
        db.query(itemsSql, [orderId], (err, itemResults) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching order items", error: err });
            }

            res.status(200).json({
                ...order,
                orderItems: itemResults
            });
        });
    });
};

// ============================================
// GET MY ORDERS
// ============================================
const getMyOrders = (req, res) => {
    const userId = req.user.id;

    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching orders", error: err });
        }
        res.status(200).json(results);
    });
};

// ============================================
// ✅ GET ALL ORDERS (Admin only) - WITH DEBUG
// ============================================
const getAllOrders = (req, res) => {
    console.log("📊 Fetching ALL orders from database...");

    const sql = `
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.id DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching all orders:", err);
            return res.status(500).json({ 
                message: "Error fetching orders", 
                error: err.message 
            });
        }
        
        console.log(`📊 Found ${results.length} orders`);
        console.log("📊 First order:", results[0] || "No orders found");
        
        res.status(200).json(results);
    });
};

// ============================================
// ✅ EXPORT ALL
// ============================================
module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders, // ✅ NOW DEFINED!
};