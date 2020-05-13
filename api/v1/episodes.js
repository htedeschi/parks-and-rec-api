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
	Season.aggregate([
		{ $unwind: "$episodes" },
		{
			$project: {
				_id: 0,
				season: "$season",
				number_overall: "$episodes.number_overall",
				number_season: "$episodes.number_season",
				title: "$episodes.title",
				directed_by: "$episodes.directed_by",
				written_by: "$episodes.written_by",
				air_date : {$add: [new Date(0), "$episodes.air_date"]},
				viewers: "$episodes.viewers",
			},
		},
	])
		.then((data) => {
			res.json(data).end();
		})
		.catch((err) => {
			res.json(err).end();
		});
});

router.get("/:title", (req, res) => {
	const title = req.params.title;
	Season.aggregate([
		{ $unwind: "$episodes" },
        { $match : {'episodes.title': { $regex: title, $options: "i" } }},
		{
			$project: {
				_id: 0,
				season: "$season",
				number_overall: "$episodes.number_overall",
				number_season: "$episodes.number_season",
				title: "$episodes.title",
				directed_by: "$episodes.directed_by",
				written_by: "$episodes.written_by",
				air_date : {$add: [new Date(0), "$episodes.air_date"]},
				viewers: "$episodes.viewers",
			},
		},
	])
		.then((data) => {
			res.json(data).end();
		})
		.catch((err) => {
			res.json(err).end();
		});
});

module.exports = router;
