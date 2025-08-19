// Import and configure dotenv
require("dotenv").config();

// Import necessary modules
const mongoose = require("mongoose");

/**
 * URI to the db server (local for this moment)
 */
const dbServer = process.env.DB_SERVER;

/** MongoDB connection string */
const connectionString = dbServer;

// Event listener for any MongoDB connection error
mongoose.connection.on("error", (err) => {
  console.error("Error with connection to the MongoDB server: " + err.message);
});

// Event listener for when Mongoose starts connecting to MongoDB
mongoose.connection.on("connecting", () => {
  console.log("Connecting to the MongoDB server...");
});

// Event listener for when Mongoose successfully connects to MongoDB
mongoose.connection.on("connected", () => {
  console.log("Connected to the MongoDB server");
});

// Event listener for when Mongoose disconnects from MongoDB
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from the MongoDB server");
});

/**
 * Connects to the MongoDB server.
 */
async function connect() {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process in case of connection failure
  }
}

mongoose.set("debug", true);

/**
 * Closes the connection to the MongoDB server.
 */
async function close() {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}

module.exports = { connect, close };
