const express = require("express");
const router = express.Router();
const Season = require("../../models/Season");

router.get("/ping", (req, res) => {
	res.json({
		success: true,
		date: new Date(),
	});
	res.end();
});

router.get("/", (req, res) => {
	Season.find({}, { _id: 0 })
		.then((data) => {
			res.json(data).end();
		})
		.catch((err) => {
			res.json(err).end();
		});
});

router.get("/:season", (req, res) => {
	const season = req.params.season;
	Season.find(
		{ season: { $regex: season, $options: "i" } },
		{ _id: 0 }
	)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
