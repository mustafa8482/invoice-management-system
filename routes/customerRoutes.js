const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

// Add Customer Page
router.get("/customers/add", customerController.addCustomerPage);

// Save Customer
router.post("/customers/add", customerController.saveCustomer);

// View All Customers
router.get("/customers", customerController.getCustomers);

module.exports = router;

// Edit Customer Page
router.get("/customers/edit/:id", customerController.editCustomerPage);

// Update Customer
router.post("/customers/edit/:id", customerController.updateCustomer);

//Delete customer
router.get("/customers/delete/:id", customerController.deleteCustomer);