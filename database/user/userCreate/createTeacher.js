
require("dotenv").config();
const { Client } = require("pg");
const readline = require("readline");

// PostgreSQL client
const client = new Client({
	user: process.env.DB_USER,
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

		const userid = await ask("Teacher ID: ");
    const doubleLesson = await ask("Do you do double lessons ('n' or 'Y': ");    
    let doubleLessonBool = true;
    if (doubleLesson == 'n'){
      doubleLessonBool = false;
    }

		// Insert user
		await client.query(
			`INSERT INTO teacher 
        (userid, does_double_lesson)
       VALUES ($1, $2)`,
		  [
				userid,
        doubleLessonBool,
    	]
		);

		console.log("\n✅ Teacher added successfully!");
	} catch (err) {
		console.error("❌ Error inserting user:", err);
	} finally {
		rl.close();
		await client.end();
	}
})();
