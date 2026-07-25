const jwt = require("jsonwebtoken");

const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
    try {

        const { full_name, email, password } = req.body;

        // Check if email already exists
        const checkQuery = "SELECT * FROM users WHERE email = ?";

        db.query(checkQuery, [email], async (err, result) => {

            if (err) {
                return res.send("Database Error");
            }

            if (result.length > 0) {
                return res.send("Email already exists");
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert User
            const insertQuery = `
                INSERT INTO users (full_name, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertQuery,
                [full_name, email, hashedPassword],
                (err) => {

                    if (err) {
                        return res.send("Registration Failed");
                    }

                    res.send("✅ User Registered Successfully");

                }
            );

        });

    } catch (error) {

        console.log(error);

        res.send("Server Error");

    }
};


exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.send("Database Error");
        }

        if (result.length === 0) {
            return res.send("Invalid Email or Password");
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid Email or Password");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/dashboard");

    });

};