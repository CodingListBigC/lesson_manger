const express = require("express")
const middleware = require("../../../security/middleware")
const router = express.Router();
const getLessonData = require("../../../database/getLessonData.js")
router.get("/",middleware.isLoggedIn,(req,res) => {
	res.render("account/mainPage", {
		user: req.session.user,
	});
});

router.get("/lesson", middleware.isLoggedIn, (req, res) => {
	res.render("account/lesson");
});

router.get("/instrument", middleware.isLoggedIn, (req, res) => {
	res.render("account/lesson", {
    lesson: req.session.user
  });
});

module.exports = router;
