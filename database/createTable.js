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
				teacherID INTEGER DEFAULT NULL,
				lessonID INTEGER DEFAULT NULL,
				instrumentID INTEGER DEFAULT NULL,
				roleNumber REAL DEFAULT 6,
				firstName VARCHAR(255) NOT NULL,
				lastName VARCHAR(255) NOT NULL,
				userName VARCHAR(20) NOT NULL,
				password VARCHAR(20) NOT NULL,
				birth DATE NOT NULL,
				teacherNumber INTEGER DEFAULT 0,
				freeAvailable BOOLEAN DEFAULT TRUE,
				nextLesson INTEGER DEFAULT NULL,
				lastLesson INTEGER DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS lesson (
				id SERIAL PRIMARY KEY,
				lessonID INTEGER,
				studentID INTEGER,
				teacherID INTEGER,
				lessonStart TIME DEFAULT NULL,
				lessonEnd TIME DEFAULT NULL,
				lessonDate DATE DEFAULT NULL,
				makeUp BOOLEAN DEFAULT FALSE
			);

			CREATE TABLE IF NOT EXISTS teacher (
				id SERIAL PRIMARY KEY,
				hoursID INTEGER DEFAULT NULL,
				instrumentListID INTEGER DEFAULT NULL,
				lesssonListToday INTEGER DEFAULT NULL,
				doesDoubleLesson BOOLEAN DEFAULT FALSE
			);

			CREATE TABLE IF NOT EXISTS instrumentID (
				id SERIAL PRIMARY KEY,
				personID INTEGER,
				type REAL DEFAULT NULL,
				company VARCHAR(22) DEFAULT NULL,
				model VARCHAR(20) DEFAULT NULL,
				serialNumber INTEGER DEFAULT NULL,
				loaner BOOLEAN DEFAULT TRUE
			);

			CREATE TABLE IF NOT EXISTS instrumentList (
				id SERIAL PRIMARY KEY,
				personID INTEGER,
				primaryIns INTEGER DEFAULT NULL,
				secondary INTEGER DEFAULT NULL,
				restOfInstrument INTEGER[] DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS todayLesson (
				id SERIAL PRIMARY KEY,
				teacherID INTEGER,
				nextLessonID INTEGER DEFAULT NULL,
				afterLessonID INTEGER DEFAULT NULL,
				listOfLessonsID INTEGER[] DEFAULT NULL,
				date DATE DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS todayLessonOffic (
				id SERIAL PRIMARY KEY
			);

			CREATE TABLE IF NOT EXISTS hoursDaily (
				id SERIAL PRIMARY KEY,
				teacherID INTEGER DEFAULT NULL,
				dayOfWeek INTEGER DEFAULT NULL,
				dayStart TIME DEFAULT NULL,
				dayEnd TIME DEFAULT NULL,
				changeNext BOOLEAN DEFAULT FALSE,
				dayChangeStart TIME DEFAULT NULL,
				dayChangeEnd TIME DEFAULT NULL,
				breakStart TIME DEFAULT NULL,
				breakEnd TIME DEFAULT NULL,
				break1Start TIME DEFAULT NULL,
				break1End TIME DEFAULT NULL,
				vitural BOOLEAN DEFAULT FALSE,
				outOfOffic BOOLEAN DEFAULT TRUE
			);

			CREATE TABLE IF NOT EXISTS teacherHoursDaily (
				id SERIAL PRIMARY KEY,
				teacherID INTEGER DEFAULT NULL,
				monID INTEGER DEFAULT NULL,
				tuesID INTEGER DEFAULT NULL,
				wedID INTEGER DEFAULT NULL,
				thurID INTEGER DEFAULT NULL,
				firID INTEGER DEFAULT NULL,
				satID INTEGER DEFAULT NULL,
				sunID INTEGER DEFAULT NULL
			);
		`;

		return client.query(createTable);
	})
	.then(() => {
		console.log("✅ Tables created successfully!");
	})
	.catch((err) => {
		console.error("❌ Error creating tables:", err);
	})
	.finally(() => {
		client.end();
	});