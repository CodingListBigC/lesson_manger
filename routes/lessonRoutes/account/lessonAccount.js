const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
	res.render("account/mainSite");
});

router.get("/lesson", (req, res) => {
	res.render("account/lesson");
});
module.exports = router;
