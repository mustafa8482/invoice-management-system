const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

// Add Invoice Page
router.get("/invoices/add", invoiceController.addInvoicePage);

// Save Invoice
router.post("/invoices/add", invoiceController.saveInvoice);

// View All Invoices
router.get("/invoices", invoiceController.getInvoices);

module.exports = router;