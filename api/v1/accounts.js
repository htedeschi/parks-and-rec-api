const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");

router.get("/ping", (req, res) => {
	res.json({
		success: true,
		date: new Date(),
	});
	res.end();
});

router.get("/:id", (req, res) => {
	const id = req.params.id;
	Account.find({ _id: id }, { _id: 0 })
		.then((data) => {
			// send email with token

			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.post("/", (req, res) => {
	if (!req.body.email) {
		res.status(422);
		res.statusMessage = 'Missing parameter "email"';
		res.end();
		return;
	}

	const jwt = require("jsonwebtoken");
	const email = req.body.email;
	const token = jwt.sign({ email }, process.env.JWT_KEY);

	const account = new Account({
		email,
		token,
	});

	account
		.save()
		.then((data) => {
			console.log(`Success! ${data}`);
			res.json({ success: true, date: new Date() });

			// send email to confirm email
		})
		.catch((err) => {
			console.log(`Error! ${err}`);
			res.json(err);
		});
});

module.exports = router;
