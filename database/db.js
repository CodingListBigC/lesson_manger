// This file sets up a connection to a PostgreSQL database using the 'pg' package.

import dotenv from 'dotenv';
dotenv.config();

// Import the 'pg' package to interact with PostgreSQL
import pkg from 'pg';
const { Client } = pkg;

// Create a new client instance using environment variables
const client = new Client({
  user: process.env.DB_USER,     // DB username from .env
  host: process.env.DB_HOST,     // DB host from .env
  database: process.env.DB_NAME, // DB name from .env
  password: process.env.DB_PASSWORD, // DB password from .env
  port: process.env.DB_PORT,     // DB port from .env
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

// Export the client so other parts of your app can use it
export default client;

