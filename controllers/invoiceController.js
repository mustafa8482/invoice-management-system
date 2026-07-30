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
    invoice_date,
    invoice_items,
    subtotal,
    gst,
    grand_total
} = req.body;

const items = JSON.parse(invoice_items);
    const sql = `
        INSERT INTO invoices
        (customer_id, invoice_number, invoice_date, total, gst, grand_total)
        VALUES (?, ?, ?, ?, ?, ?)
    `; 

    db.query(
        sql,
       [
    customer_id,
    invoice_number,
    invoice_date,
    subtotal,
    gst,
    grand_total
],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            const invoiceId = result.insertId;
            console.log(invoiceId);
            console.log(items); 


            const itemSql = `
    INSERT INTO invoice_items
    (invoice_id, product_id, quantity, price, gst, total)
    VALUES (?, ?, ?, ?, ?, ?)
`;

items.forEach((item) => {

    db.query(
        itemSql,
        [
            invoiceId,
            item.product_id,
            item.quantity,
            item.price,
            18, // फिलहाल GST fixed rakhte hain
            item.total
        ],
        (err) => {

            if (err) {
                console.log(err);
            }

        }
    );

});

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