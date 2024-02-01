const express = require('express'); // Creates an Express server
const router = express.Router(); // Creates a router object
const User = require('../models/user'); // Imports the User model
const Country = require('../models/country'); // Imports the Country model

// POST route for registering a new user
router.post('/register', async (req, res) => {
    
    try {
        const { firstName, lastName, username, password, country } = req.body;

        // Find the country ObjectId based on country name
        const countryDoc = await Country.findOne({ name: country });
        if (!countryDoc) {
            return res.status(400).json({ message: 'Country not found' });
        }

        // Find the username to check if it already exists in the database
        const existingUser = await User.findOne({ username: username.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please try a different username.' });
        }

        // Create a new user instance with the country ObjectId
        const user = new User({ 
            firstName, 
            lastName, 
            username: username.trim().toLowerCase(),
            password, 
            country: countryDoc._id 
        });

        // Save the user to the database
        await user.save();

        // Send success response
        res.status(201).json({ message: 'Registration successful! You can now log in.' });
    } catch (error) {
        // Send error response
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// POST route for logging in a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username.trim().toLowerCase() }).exec();
        if (user && await user.comparePassword(password)) {
            req.session.username = user.username;
            req.session.isLoggedIn = true;
      
            // Save the session before sending the response
            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ message: 'Error during login', error: err });
                }
                res.json({ message: 'Login successful', username: user.username, isLoggedIn: req.session.isLoggedIn });
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Route to handle user's logout.
router.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(error => {
        if (error) {
            res.status(500).json({ error: 'Error during logout' });
        } else {
            res.status(200).json({ message: 'Logout successful', isLoggedIn: false });
        }
        });
    }
);

// Route to fetch the user's login status and details.
router.get('/session', (req, res) => {
    if (req.session.isLoggedIn) {
        res.json({ isLoggedIn: true, username: req.session.username });
    } else {
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;

