const db = require("../config/db");
const puppeteer = require("puppeteer");

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
             customers,
             products,
             isEdit: false,
             invoice: {},
             items: []
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
    discount,
    gst,
    grand_total
} = req.body;

const items = JSON.parse(invoice_items);
    const sql = `
        INSERT INTO invoices
        (customer_id, invoice_number, invoice_date, total, discount, gst, grand_total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `; 

    db.query(
        sql,
       [
    customer_id,
    invoice_number,
    invoice_date,
    subtotal,
    discount,
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

// View Single Invoice
exports.viewInvoice = (req, res) => {

    const invoiceId = req.params.id;

    const sql = `
        SELECT
            invoices.*,
            customers.customer_name,
            customers.email,
            customers.phone,
            customers.address
        FROM invoices
        JOIN customers
        ON invoices.customer_id = customers.id
        WHERE invoices.id = ?
    `;

    db.query(sql, [invoiceId], (err, invoiceResult) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        const itemSql = `
            SELECT
                invoice_items.*,
                products.product_name
            FROM invoice_items
            JOIN products
            ON invoice_items.product_id = products.id
            WHERE invoice_items.invoice_id = ?
        `;

        db.query(itemSql, [invoiceId], (err, itemResult) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.render("invoices/viewInvoice", {
                invoice: invoiceResult[0],
                items: itemResult
            });

        });

    });

};


// Delete Invoice
exports.deleteInvoice = (req, res) => {

    const invoiceId = req.params.id;

    // Pehle invoice_items delete karo
    db.query(
        "DELETE FROM invoice_items WHERE invoice_id = ?",
        [invoiceId],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            // Fir invoice delete karo
            db.query(
                "DELETE FROM invoices WHERE id = ?",
                [invoiceId],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Database Error");
                    }

                    res.redirect("/invoices");

                }
            );

        }
    );

};

// Download Invoice PDF
exports.downloadInvoicePDF = async (req, res) => {

    try {

        const invoiceId = req.params.id;

        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.goto(
            `http://localhost:5000/invoices/${invoiceId}`,
            {
                waitUntil: "networkidle0"
            }
        );

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=Invoice-${invoiceId}.pdf`
        });

        res.send(pdf);

    } catch (err) {

        console.log(err);
        res.send("PDF Generation Error");

    }

};

// Edit Invoice Page
exports.editInvoicePage = (req, res) => {

    const invoiceId = req.params.id;

    const customerSql = "SELECT * FROM customers";
    const productSql = "SELECT * FROM products";

    const invoiceSql = `
        SELECT *
        FROM invoices
        WHERE id = ?
    `;

    const itemSql = `
        SELECT *
        FROM invoice_items
        WHERE invoice_id = ?
    `;

    db.query(customerSql, (err, customers) => {

        if (err) return res.send(err);

        db.query(productSql, (err, products) => {

            if (err) return res.send(err);

            db.query(invoiceSql, [invoiceId], (err, invoiceResult) => {

                if (err) return res.send(err);

                db.query(itemSql, [invoiceId], (err, items) => {

                    if (err) return res.send(err);

                  res.render("invoices/addInvoice", {
                  customers,
                  products,
                  invoice: invoiceResult[0],
                  items,
                  isEdit: true
              });

                });

            });

        });

    });

};


// Update Invoice
exports.updateInvoice = (req, res) => {

    const invoiceId = req.params.id;

    const {
        customer_id,
        invoice_number,
        invoice_date,
        invoice_items,
        subtotal,
        discount,
        gst,
        grand_total
    } = req.body;

    const items = JSON.parse(invoice_items);

    const updateSql = `
        UPDATE invoices
        SET
            customer_id = ?,
            invoice_number = ?,
            invoice_date = ?,
            total = ?,
            discount = ?,
            gst = ?,
            grand_total = ?
        WHERE id = ?
    `;

    db.query(
        updateSql,
        [
            customer_id,
            invoice_number,
            invoice_date,
            subtotal,
            discount,
            gst,
            grand_total,
            invoiceId
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            // Delete old invoice items
            db.query(
                "DELETE FROM invoice_items WHERE invoice_id = ?",
                [invoiceId],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Database Error");
                    }

                    const itemSql = `
                        INSERT INTO invoice_items
                        (invoice_id, product_id, quantity, price, gst, total)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    items.forEach(item => {

                        db.query(
                            itemSql,
                            [
                                invoiceId,
                                item.product_id,
                                item.quantity,
                                item.price,
                                18,
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

        }
    );

};