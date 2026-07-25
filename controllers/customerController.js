const db = require("../config/db");

// Add Customer Page
exports.addCustomerPage = (req, res) => {
    res.render("customers/addCustomer");
};

// Save Customer
exports.saveCustomer = (req, res) => {

    const { customer_name, email, phone, address } = req.body;

    const sql = `
        INSERT INTO customers (customer_name, email, phone, address)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [customer_name, email, phone, address], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("❌ Database Error");
        }

        res.send("✅ Customer Added Successfully");

    });

};

exports.getCustomers = (req, res) => {

    const sql = "SELECT * FROM customers";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("customers/customers", {
            customers: result
        });

    });

};

//edit customer page
exports.editCustomerPage = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM customers WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("customers/editCustomer", {
            customer: result[0]
        });

    });

};

//upadte customer
exports.updateCustomer = (req, res) => {

    const id = req.params.id;

    const { customer_name, email, phone, address } = req.body;

    const sql = `
        UPDATE customers
        SET customer_name=?, email=?, phone=?, address=?
        WHERE id=?
    `;

    db.query(sql,
        [customer_name, email, phone, address, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/customers");

        });

};