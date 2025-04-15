// This file sets up a connection to a PostgreSQL database using the 'pg' package.
require("dotenv").config();

// Import the 'pg' package to interact with PostgreSQL
const { Client } = require("pg");

// Create a new client instance using environment variables
const client = new Client({
	user: process.env.DB_USER, // DB username from .env
	host: process.env.DB_HOST, // DB host from .env
	database: process.env.DB_NAME, // DB name from .env
	password: process.env.DB_PASSWORD, // DB password from .env
	port: process.env.DB_PORT, // DB port from .env
});

// Connect to the PostgreSQL database
client
	.connect()
	.then(() => {
		console.log("Connected to PostgreSQL!");
	})
	.catch((err) => {
		console.error("Connection error", err.stack);
	});

// Optional: Create a table if it doesn't exist (you might want to run this separately just once)
// const createTable = `
// CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   userName VARCHAR(20) NOT NULL,
//   password VARCHAR(20) NOT NULL,
//   birthDay INTEGER NOT NULL,
//   birthMonth INTEGER NOT NULL,
//   birthYear INTEGER NOT NULL,
//   teacher BOOLEAN DEFAULT FALSE
// )`;

// client
// 	.query(createTable)
// 	.then(() => console.log("Table created or already exists"))
// 	.catch((err) => console.error("Error creating table", err.stack));

// Export the client so other parts of your app can use it
module.exports = client;
