const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {

    db.query("SELECT COUNT(*) AS totalCustomers FROM customers", (err, customerResult) => {

        if (err) return res.send(err);

        db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, productResult) => {

            if (err) return res.send(err);

            db.query("SELECT COUNT(*) AS totalInvoices FROM invoices", (err, invoiceResult) => {

                if (err) return res.send(err);

                db.query("SELECT SUM(grand_total) AS totalRevenue FROM invoices", (err, revenueResult) => {

                    if (err) return res.send(err);

db.query(`
    SELECT
        invoices.invoice_number,
        invoices.invoice_date,
        invoices.grand_total,
        customers.customer_name
    FROM invoices
    JOIN customers
        ON invoices.customer_id = customers.id
    ORDER BY invoices.id DESC
    LIMIT 5
`, (err, recentInvoices) => {

    if (err) return res.send(err);

    res.render("dashboard", {
        user: req.user,
        totalCustomers: customerResult[0].totalCustomers,
        totalProducts: productResult[0].totalProducts,
        totalInvoices: invoiceResult[0].totalInvoices,
        totalRevenue: revenueResult[0].totalRevenue || 0,
        recentInvoices
    });

});
                });

            });

        });

    });

});

module.exports = router;