const express = require('express'); // Creates an Express server
const router = express.Router(); // Creates a router object
const Country = require('../models/country'); // Import the Country model

// Define the route to get the all countries
router.get('/', async (req, res) => {
    try {
        const countries = await Country.getAllCountryDetails();
     
        if (countries) {
            // Send the response (200 OK) and countries
            res.status(200).json(countries);
        } else {
            // Send the response (404 Not Found) and a message
            res.status(404).json({ message: 'Countries not found' }); 
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define the route to get the a country based on its name
router.get('/:countryName', async (req, res) => {
    try {
      const countryDetails = await Country.getCountry(req.params.countryName);
      if (countryDetails) {
        res.status(200).json(countryDetails);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
