const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

async function signup(req, res) {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const validRole = ["interviewer", "candidate"].includes(role) ? role : "interviewer";

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }

        const user = await User.create({ name, email, password, role: validRole });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(500).json({ error: "Signup failed" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
}

module.exports = { signup, login };