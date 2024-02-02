const express = require('express');
const userModel = require('../Models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// User registration
router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUser = await userModel.createUser(username, email, password);
        res.json(newUser);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);

        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

            req.session.token = token;

            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
