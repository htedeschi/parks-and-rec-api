const express = require("express");
const router = express.Router();
const BandName = require("../../models/BandName");

router.get("/ping", (req, res) => {
	res.json({
		success: true,
		date: new Date(),
	});
	res.end();
});

router.get("/", (req, res) => {
	BandName.find({}, { _id: 0 })
		.then((data) => {
			res.json(data).end();
		})
		.catch((err) => {
			res.json(err).end();
		});
});

router.get("/:name", (req, res) => {
	const name = req.params.name;
	BandName.find({ name: { $regex: name, $options: "i" } }, { _id: 0 })
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
