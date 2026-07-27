const db = require("../config/db");

// Add Product Page
exports.addProductPage = (req, res) => {
    res.render("products/addProduct");
};

// Save Product
exports.saveProduct = (req, res) => {

    const {
        product_name,
        hsn_code,
        category,
        price,
        gst_percentage,
        stock,
        unit,
        description
    } = req.body;

    const sql = `
        INSERT INTO products
        (product_name, hsn_code, category, price, gst_percentage, stock, unit, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            product_name,
            hsn_code,
            category,
            price,
            gst_percentage,
            stock,
            unit,
            description
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/products");

        }
    );

};

// View Products
exports.getProducts = (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("products/products", {
            products: result
        });

    });

};

// Edit Product Page
exports.editProductPage = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.render("products/editProduct", {
            product: result[0]
        });

    });

};

// Update Product
exports.updateProduct = (req, res) => {

    const id = req.params.id;

    const {
        product_name,
        hsn_code,
        category,
        price,
        gst_percentage,
        stock,
        unit,
        description
    } = req.body;

    const sql = `
        UPDATE products
        SET product_name=?, hsn_code=?, category=?, price=?, gst_percentage=?, stock=?, unit=?, description=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            product_name,
            hsn_code,
            category,
            price,
            gst_percentage,
            stock,
            unit,
            description,
            id
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Database Error");
            }

            res.redirect("/products");

        });

};

// Delete Product
exports.deleteProduct = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/products");

    });

};


// Get Product By ID (API)
exports.getProductById = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }

        res.json(result[0]);

    });

};