const express = require('express');
const router = express.Router();
const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.findUserByEmail(req.user.email);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/edit', isAuthenticated, async (req, res) => {
    const { username, age, dob, contact, address, imageUrl, description } = req.body;

    try {
        const result = await userModel.updateUserProfile(req.user.email, {
            username,
            age,
            dob,
            contact,
            address,
            imageUrl,
            description,
        });

        if (result) {
            res.json({ message: 'Profile updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
