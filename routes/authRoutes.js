const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", authController.registerUser);

module.exports = router;

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/login", authController.loginUser);