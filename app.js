// Import necessary modules
require('dotenv').config(); // imports and configures dotenv 
const express = require('express'); // for creating an Express server
const cors = require('cors'); // for enabling CORS support
const database = require('./db-handler'); // for connection to database
const session = require('express-session'); // for managing sessions
const MongoStore = require('connect-mongo'); // for storing session data

// Import routes
const countriesRoute = require('./routes/countries');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

/*
 * The Express server instance.
 */
const app = express();

/**
 * The port on which the Express server will listen for incoming requests.
 * Uses the environment variable PORT, if it exists, or defaults to 3000.
 */
const port = process.env.PORT || 3000;

/**
 * The path on the domain to version 1 of the API.
 */
const apiPath = '/api/v1';

// Add CORS middleware to server to handle cross-origin requests
app.use(cors({
    origin:['https://studenter.miun.se', 'http://localhost:4200'],
    credentials: true, // allows credentials like cookies to be sent
}));

// Add JSON Parsing middleware to parse incoming request with JSON payloads.
app.use(express.json());

// Add URL Encoded Payload Parsing middleware to server, 
// allowing it to handle incoming request with url encoded payloads.
app.use(express.urlencoded({ extended: true }));

// Trust the proxy
app.set('trust proxy', 1);

// Add session middleware to server
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DB_SERVER }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 3600000 // 1 hour
    }
}));

// Use router to handle requests to the /api/v1 path.
app.use(`${apiPath}/countries`, countriesRoute)
app.use(`${apiPath}`, userRoutes);
app.use(`${apiPath}`, postRoutes);
app.use(`${apiPath}`, commentRoutes);


// Connect to the database using the module db-handler.js
database.connect().then(mongoose => {
    app.listen(port, function() {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Error starting the server:', error);
})


