const express = require("express")
const middleware = require("../../../security/middleware")
const router = express.Router();
router.get("/",middleware.isLoggedIn,(req,res) => {
	res.render("account/mainPage", {
		user: req.session.user,
	});
});

router.get("/lesson", (req, res) => {
	res.render("account/lesson");
});

router.get("/instrument", (req, res) => {
	res.render("account/lesson");
});

module.exports = router;
