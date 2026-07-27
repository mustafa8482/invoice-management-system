const db = require("../config/db");

// Add Invoice Page
// Add Invoice Page
exports.addInvoicePage = (req, res) => {

    const customerSql = "SELECT * FROM customers";
    const productSql = "SELECT * FROM products";

    db.query(customerSql, (err, customers) => {

        if (err) {
            console.log(err);
            return res.send("Customer Database Error");
        }

        db.query(productSql, (err, products) => {

            if (err) {
                console.log(err);
                return res.send("Product Database Error");
            }

            res.render("invoices/addInvoice", {
                customers: customers,
                products: products
            });

        });

    });

};


// Save Invoice
exports.saveInvoice = (req, res) => {

    const {
        customer_id,
        invoice_number,
        invoice_date
    } = req.body;

    const sql = `
        INSERT INTO invoices
        (customer_id, invoice_number, invoice_date, total, gst, grand_total)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customer_id, invoice_number, invoice_date, 0, 0, 0],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/invoices");

        }
    );

};

// View All Invoices
exports.getInvoices = (req, res) => {

    const sql = `
        SELECT invoices.*, customers.customer_name
        FROM invoices
        JOIN customers
        ON invoices.customer_id = customers.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("invoices/invoices", {
            invoices: result
        });

    });

};