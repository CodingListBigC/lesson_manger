const express = require("express"); // Import express framework
const router = express.Router(); // Router instance for handling routes

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

module.exports = router; // Export the router instance
