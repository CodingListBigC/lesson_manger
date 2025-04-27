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

		const firstName = await ask("First Name: ");
        const lastName = await ask("Last Name: ");
        
		const userName = await ask("Username: ");
		const password = await ask("Password: ");
		const birth = await ask("Birthdate (YYYY-MM-DD): ");


		// Insert user
		await client.query(
			`INSERT INTO users 
        (first_Name, last_Name, user_Name, password, birth)
       VALUES ($1, $2, $3, $4, $5)`,
			[
				firstName,
        lastName,
				userName,
				password,
				birth
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
