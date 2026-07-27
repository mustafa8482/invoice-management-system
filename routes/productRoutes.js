const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// Add Product
router.get("/products/add", productController.addProductPage);
router.post("/products/add", productController.saveProduct);

// View Products
router.get("/products", productController.getProducts);

// Edit Product
router.get("/products/edit/:id", productController.editProductPage);
router.post("/products/edit/:id", productController.updateProduct);

// Delete Product
router.get("/products/delete/:id", productController.deleteProduct);

// Get Product By ID (API)
router.get("/products/:id", productController.getProductById);

module.exports = router;