const session = require("express-session");

const isLoggedIn = (req, res, next) => {
    // Check if the user session exists
    if (req.session.user) {
        next(); // User is logged in, proceed to the next middleware or route
    } else {
        // Redirect to the login page if not logged in
        res.redirect("/lesson/login");
    }
};

module.exports = {
    isLoggedIn, // Export the function
};
