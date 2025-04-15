require("dotenv").config();
const { Client } = require("pg");
const readline = require("readline");

// PostgreSQL client
const client = new Client({
	user: process.env.DB_USERNAME,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const ask = (question) =>
	new Promise((resolve) => rl.question(question, resolve));

(async () => {
	try {
		await client.connect();

		console.log("\n📝 Enter user details:\n");

		const name = await ask("Full Name: ");
		const userName = await ask("Username: ");
		const password = await ask("Password: ");
		const birth = await ask("Birthdate (YYYY-MM-DD): ");
		const teacherAnswer = await ask("Is Teacher? (yes/no): ");
		const teacher = teacherAnswer.trim().toLowerCase() === "yes";
		const teacherNumber = teacher ? parseInt(await ask("Teacher Number: ")) : 0;
		const nextLesson =
			(await ask("Next Lesson Date (YYYY-MM-DD, blank for default): ")) || null;
		const lessonTime =
			(await ask("Lesson Time (HH:MM:SS, default 00:00:00): ")) || "00:00:00";
		const lessonDuration = parseInt(
			(await ask("Lesson Duration (Each Slot is 30 Mintues, default 1): ")) ||
				"1"
		);

		// Insert user
		await client.query(
			`INSERT INTO users 
        (name, username, password, birth, teacher, teacherNumber, nextLesson, lessonTime, lessonDuration)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
			[
				name,
				userName,
				password,
				birth,
				teacher,
				teacherNumber,
				nextLesson || null,
				lessonTime,
				lessonDuration,
			]
		);

		console.log("\n✅ User added successfully!");
	} catch (err) {
		console.error("❌ Error inserting user:", err);
	} finally {
		rl.close();
		await client.end();
	}
})();
