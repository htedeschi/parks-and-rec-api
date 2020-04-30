const express = require("express");
const router = express.Router();
const Character = require("../../models/Character");

router.get("/ping", (req, res) => {
	res.json({
		success: true,
		date: new Date(),
	});
	res.end();
});

router.get("/", (req, res) => {
	Character.find({}, {_id:0})
		.then((data) => {
			res.json(data).end();
		})
		.catch((err) => {
			res.json(err).end();
		});
});

router.get("/:name", (req, res) => {
	const name = req.params.name;
	Character.find({
		$or: [
			{ name: { $regex: name, $options: "i" } },
			{ portrayed: { $regex: name, $options: "i" } },
		],
	}, {_id:0})
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.post("/", (req, res) => {
	if (!req.body.name) {
		res.status(422);
		res.statusMessage = 'Missing parameter "name"';
		res.end();
		return;
    }

	if (!req.body.portrayed) {
		res.status(422);
		res.statusMessage = 'Missing parameter "portrayed"';
		res.end();
		return;
	}

	const name = req.body.name;
	const portrayed = req.body.portrayed;
	const background = req.body.background;
	const personality = req.body.personality;

	const character = new Character({
		name,
		portrayed,
		background,
		personality
	});

	character
		.save()
		.then((data) => {
			console.log(`Success! ${data}`);
			res.json(data);
		})
		.catch((err) => {
			console.log(`Error! ${err}`);
			res.json(err);
		});
});

module.exports = router;
