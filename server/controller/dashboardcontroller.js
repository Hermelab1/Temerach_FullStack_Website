const db = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        const { start, end } = req.query;

        const [orderStats] = await db.sequelize.query(
            `SELECT SUM(totalAmount) as revenue, COUNT(id) as totalOrders 
             FROM orders WHERE orderDate BETWEEN ? AND ?`,
            { replacements: [start, end] }
        );

        const [customerStats] = await db.sequelize.query(
            `SELECT COUNT(id) as total FROM secusers WHERE isActive = 1`
        );

        const [pendingStats] = await db.sequelize.query(
            `SELECT COUNT(id) as pending FROM orders WHERE status = 'PENDING'`
        );

        res.json({
            stats: [
                { title: 'Total Revenue', value: `$${orderStats[0].revenue || 0}`, icon: 'fa-dollar-sign', color: 'text-green-600', bg: 'bg-green-100' },
                { title: 'New Orders', value: orderStats[0].totalOrders.toString(), icon: 'fa-shopping-cart', color: 'text-blue-600', bg: 'bg-blue-100' },
                { title: 'Total Users', value: customerStats[0].total.toString(), icon: 'fa-users', color: 'text-purple-600', bg: 'bg-purple-100' },
                { title: 'Pending Shipments', value: pendingStats[0].pending.toString(), icon: 'fa-truck', color: 'text-orange-600', bg: 'bg-orange-100' },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const [orders] = await db.sequelize.query(
            `SELECT orderNumber as id, customerName as product, status, totalAmount as amount 
             FROM orders ORDER BY createdAt DESC LIMIT 5`
        );

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardAlerts = async (req, res) => {
    try {
        const [lowStock] = await db.sequelize.query(
            `SELECT itemName, stockQty FROM items WHERE stockQty < 10 LIMIT 2`
        );

        const [newMessages] = await db.sequelize.query(
            `SELECT FullName FROM contacts WHERE isRead = 0 LIMIT 2`
        );

        const alerts = [
            ...lowStock.map(item => ({
                type: 'stock',
                title: 'Low Stock',
                message: `${item.itemName}: ${item.stockQty} left`,
                color: 'red'
            })),
            ...newMessages.map(msg => ({
                type: 'review',
                title: 'New Inquiry',
                message: `Message from ${msg.FullName}`,
                color: 'blue'
            }))
        ];

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};