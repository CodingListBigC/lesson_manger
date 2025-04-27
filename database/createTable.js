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
				lesson_ID INTEGER[] DEFAULT NULL,
				instrument_ID INTEGER DEFAULT NULL,
				role_Number REAL DEFAULT 6,
				first_Name VARCHAR(255) NOT NULL,
				last_Name VARCHAR(255) NOT NULL,
				user_Name VARCHAR(20) NOT NULL,
				password VARCHAR(20) NOT NULL,
				birth DATE NOT NULL,
				teacher_Number INTEGER DEFAULT 0,
				free_Available BOOLEAN DEFAULT TRUE,
				next_Lesson INTEGER DEFAULT NULL,
				last_Lesson INTEGER DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS lessonDefault (
				id SERIAL PRIMARY KEY,
				student_ID INTEGER,
				teacher_ID INTEGER,
				lesson_start TIME DEFAULT NULL,
				lesson_length INT DEFAULT NULL,
				lesson_weekday INTEGER DEFAULT NULL,
        insturemnt_type INTEGER DEFAULT NULL,
				make_up_available BOOLEAN DEFAULT FALSE,
        up_comming_lessons_ID INT[] DEFAULT NULL,
        list_of_lessons_ID INT[] DEFAULT NULL
			);
      
			CREATE TABLE IF NOT EXISTS lesson (
				id SERIAL PRIMARY KEY,
				student_ID INTEGER,
				teacher_ID INTEGER,
				lesson_start TIME DEFAULT NULL,
				lesson_date DATE DEFAULT NULL,
				make_up_available BOOLEAN DEFAULT FALSE,
        is_changed_lesson BOOLEAN DEFAULT FALSE,
        change_lesson_time TIME DEFAULT NULL,
        change_lesson_date DATE DEFAULT NULL
  );

			CREATE TABLE IF NOT EXISTS teacher (
				id SERIAL PRIMARY KEY,
				hours_ID INTEGER[] DEFAULT NULL,
				instrument_List_ID INTEGER DEFAULT NULL,
				lessson_List_Today INTEGER DEFAULT NULL,
				does_Double_Lesson BOOLEAN DEFAULT FALSE
			);

			CREATE TABLE IF NOT EXISTS instrumentID (
				id SERIAL PRIMARY KEY,
				user_ID INTEGER,
				type REAL DEFAULT NULL,
				company VARCHAR(22) DEFAULT NULL,
				model VARCHAR(20) DEFAULT NULL,
				serial_Number INTEGER DEFAULT NULL,
				loaner BOOLEAN DEFAULT TRUE
			);

			CREATE TABLE IF NOT EXISTS instrumentList (
				id SERIAL PRIMARY KEY,
				user_ID INTEGER,
				primaryIns INTEGER DEFAULT NULL,
				secondary INTEGER DEFAULT NULL,
				restOfInstrument INTEGER[] DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS todayLesson (
				id SERIAL PRIMARY KEY,
				teacherID INTEGER,
				next_Lesson_ID INTEGER DEFAULT NULL,
				after_Lesson_ID INTEGER DEFAULT NULL,
				list_Of_LessonsID INTEGER[] DEFAULT NULL,
				date DATE DEFAULT NULL
			);

			CREATE TABLE IF NOT EXISTS todayLessonOffic (
				id SERIAL PRIMARY KEY
			);

			CREATE TABLE IF NOT EXISTS hoursDaily (
				id SERIAL PRIMARY KEY,
				teacher_ID INTEGER DEFAULT NULL,
				day_Of_Week INTEGER DEFAULT NULL,
				day_Start TIME DEFAULT NULL,
				day_End TIME DEFAULT NULL,
				change_Next BOOLEAN DEFAULT FALSE,
				day_Change_Start TIME DEFAULT NULL,
				day_Change_End TIME DEFAULT NULL,
				break_Start TIME DEFAULT NULL,
				break_End TIME DEFAULT NULL,
				break1_Start TIME DEFAULT NULL,
				break1_End TIME DEFAULT NULL,
				vitural BOOLEAN DEFAULT FALSE,
				out_Of_Offic BOOLEAN DEFAULT TRUE
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
