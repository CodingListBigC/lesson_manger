const express = require("express"); // Import express framework
const router = express.Router(); // Router instance for handling routes
const dbFunction = require("../../database/dbFunction");
router.get("/", (req, res) => {
	// Render the lesson page
	res.render("lesson/lesson"); // Corrected path
});

router.get("/Login", (req, res) => {
	// Render the lesson login page
	res.render("lesson/lessonLogin"); // Corrected path
});

router.get("/Register", (req, res) => {
	// Render the lesson registration page
	res.render("lesson/lessonRegister"); // Corrected path
});
router.get("/lesson.css	", (req, res) => {
	// Serve the lesson CSS file
	res.sendFile(__dirname + "/lesson/lesson.css"); // Corrected path
});

const dbClient = require("../../database/db");

router.post("/login", async (req, res) => {
	const usernameFromForm = req.body.username;
	const passwordFromForm = req.body.password;
	console.log("Username from form:", usernameFromForm);

	try {
		// Now you can use 'dbClient' to talk to your database!
		const result = await dbClient.query(
			"SELECT * FROM users WHERE username = $1",
			[usernameFromForm]
		);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			// Here you would compare the password (remember to use hashing!)
			console.log("User found:", user);
			req.session.user = {
				id: user.id,
				name: user.lastName,
				username: user.username,
				teacher: user.teacher,
				nextLesson: {
					date: user.nextLesson,
					time: user.lessonTime,
					duration: user.lessonDuration,
				},
				nextLesson: user.nextLesson,
				freeAvailable: user.freeAvailable,
			}; // Store user in session
			res.render("account/mainPage", {
				user: req.session.user,
			}); // Render the main page with user data
		} else {
			res.json({ success: false, message: "User not found." });
		}
	} catch (error) {
		console.error("Error during login:", error);
		res
			.status(500)
			.json({ success: false, message: "Something went wrong on the server." });
	}
});

module.exports = router; // Export the router instance
