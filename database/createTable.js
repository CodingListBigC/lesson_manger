// This file sets up a connection to a PostgreSQL database using the 'pg' package.
require("dotenv").config();
const { Client } = require("pg");

// Create a new client instance using environment variables
const client = new Client({
	user: process.env.DB_USER, // DB username from .env
	host: process.env.DB_HOST, // DB host from .env
	database: process.env.DB_NAME, // DB name from .env
	password: process.env.DB_PASSWORD, // DB password from .env
	port: process.env.DB_PORT, // DB port from .env
});

// Connect and create the table
client
	.connect()
	.then(() => {
		console.log("✅ Connected to PostgreSQL!");

		const createTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        userName VARCHAR(20) NOT NULL,
        password VARCHAR(20) NOT NULL,
        birth DATE NOT NULL,
        teacher BOOLEAN DEFAULT FALSE,
        teacherNumber INTEGER DEFAULT 0,
        freeAvailable BOOLEAN DEFAULT TRUE,
        nextLesson DATE DEFAULT NULL,
        lessonTime TIME DEFAULT '00:00:00',
        lessonDuration INTEGER DEFAULT 1,
        lastLessonDate DATE DEFAULT '1970-01-01',
        lastLessonTime TIME DEFAULT '00:00:00'
      );
    `;

		return client.query(createTable);
	})
	.then(() => {
		console.log("✅ Table created or already exists");
	})
	.catch((err) => {
		console.error("❌ Error creating table", err.stack);
	});

// Export the client so other parts of your app can use it
module.exports = client;
