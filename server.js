require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

// Database Connection
require("./config/db");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const authRoutes = require("./routes/authRoutes");
console.log("✅ authRoutes loaded");

app.use("/", authRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Invoice Management System Started 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});


//dasboard
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/", dashboardRoutes);