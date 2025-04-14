// Load environment variables from the .env file
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
		// Optionally, run a test query
		return client.query("SELECT NOW()");
	})
	.then((res) => {
		console.log("Database Time:", res.rows[0]);
	})
	.catch((err) => {
		console.error("Connection error", err.stack);
	})
	.finally(() => {
		// Close the connection after the query completes
		client.end();
	});

// Optional: Create a table if it doesn't exist (example)
const createTable = `
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

client
	.query(createTable)
	.then(() => console.log("Table created or already exists"))
	.catch((err) => console.error("Error creating table", err.stack));
