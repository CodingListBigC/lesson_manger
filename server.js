const express = require("express"); // Import express framework
const bodyParser = require("body-parser"); // Middleware to parse request body
const ip = require("ip"); // Get local IP address
const path = require("path"); // For resolving paths
const session = require("express-session"); // For session management
const app = express(); // Create an instance of express
const PORT = 3000; // Define the port number
const middleware = require("./security/middleware"); // Import custom middleware for security
const lessonRoutes = require("./routes/lessonRoutes/lesson"); // Import lesson routes
const database = require("./database/db.js");

// Middleware to parse request body and set up sessions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // Serve static files
app.use(express.json()); // For parsing JSON data

// Session configuration
app.use(
	session({
		secret: "38848373-91847846847378743399-93844984938984",
		resave: false,
		saveUninitialized: true,
	})
);
app.use("/lesson", lessonRoutes);
// Set EJS as the templating engine
app.set("view engine", "ejs");
// Set the views directory to the main project root
app.set("views", path.join(__dirname, "views")); // Set were the views are located

// Function to get the local IP address
function getLocalIpAddress() {
	return ip.address(); // Get the local IP address using the 'ip' package
}

// Home route redirects to login page
app.get("/", (req, res) => {
	res.redirect("/mainSite"); //Redirect to mainSite route
});
app.get("/mainSite", (req, res) => {
	res.render("public/index"); // Render index.ejs aka home page
});

// Start the server
// Listen on the specified port and log the local IP address
app.listen(PORT, () => {
	console.log(`Server is running at http://${getLocalIpAddress()}:${PORT}`); // Display Server URL in console
	console.log(`Server is running at http://localhost:${PORT}`); // Display Server URL in console for localhost
});
