const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

// Add Invoice Page
router.get("/invoices/add", invoiceController.addInvoicePage);

// Save Invoice
router.post("/invoices/add", invoiceController.saveInvoice);

// View All Invoices
router.get("/invoices", invoiceController.getInvoices);

//view single invoices
router.get("/invoices/:id", invoiceController.viewInvoice);

// Delete Invoice
router.delete("/invoices/:id", invoiceController.deleteInvoice);

module.exports = router;