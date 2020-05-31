const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	service: "Zoho",
	auth: {
		user: "api@henriquetedeschi.com", // generated zoho user
		pass: process.env.EMAIL_PWD, // generated zoho password
	},
});

const Account = require("../models/Account");

router.get("/ping", (req, res) => {
	res.json({
		success: true,
		date: new Date(),
	});
	res.end();
});

router.get("/confirm/:id", (req, res) => {
	const id = req.params.id;
	Account.findOne({ _id: id }, { _id: 0 })
		.then((data) => {
			// send email with token

			nodemailer.createTestAccount((err, account) => {
				// setup email data with unicode symbols
				let mailOptions = {
					from: '"Parks and Rec API" <api@henriquetedeschi.com>', // sender address
					replyTo: `"$Parks and Rec API" <api@henriquetedeschi.com>`,
					to: `"${data.email}" <${data.email}>`, // list of receivers
					subject: "Parks and Rec API TOKEN", // Subject line
					html: `<!DOCTYPE html>
					<html lang="en">
					
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
					</head>
					
					<body>
						<h1>Hello!</h1>
						<br>
						<h2>Here is your token:</h2>
                        <br>
                        <div style="max-width:500px; background-color: chartreuse; padding: 15px;">
                            <p style="word-break: break-all;">${data.token}</p>
                        </div>
						<br>
						<br>
						Thank you.
					</body>
					
					</html>`, // html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						res.json({ success: false });
						res.end();
						return console.log(error);
					}
					// console.log("Message sent: %s", info.messageId);
					// Preview only available when sending through an zoho account
					// console.log(
					// 	"Preview URL: %s",
					// 	nodemailer.getTestMessageUrl(info)
					// );

					// res.json({ success: true, date: new Date() });
					res.render("confirm");
					res.end();
					return;
				});
			});
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

	if (!req.body["g-recaptcha-response"]) {
		res.status(422);
		res.statusMessage = 'Missing parameter "g-recaptcha-response"';
		res.end();
		return;
	}

	const https = require("https");

	const recaptcha_secret = process.env.GRECAPTCHA;
	const recaptcha_response = req.body["g-recaptcha-response"];
	const recaptcha_url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha_secret}&response=${recaptcha_response}`;

	https.get(recaptcha_url, (resp) => {
		let data = "";

		// A chunk of data has been recieved.
		resp.on("data", (chunk) => {
			data += chunk;
		});

		resp.on("end", () => {
			data = JSON.parse(data);
			// console.log(data)
			// return;

			if (!data.success) {
				res.status(401);
				res.statusMessage =
					"Google reCAPTCHA considered you a robot, try again";
				res.end();
				return;
			}

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

					const address =
						req.protocol +
						"://" +
						req.hostname +
						(req.app.settings.port
							? ":" + req.app.settings.port
							: "") +
						"/accounts/confirm/" +
						data._id;

					// send email to confirm email
					nodemailer.createTestAccount((err, account) => {
						// setup email data with unicode symbols
						let mailOptions = {
							from:
								'"Parks and Rec API" <api@henriquetedeschi.com>', // sender address
							replyTo: `"$Parks and Rec API" <api@henriquetedeschi.com>`,
							to: `"${email}" <${email}>`, // list of receivers
							subject: "Confirm your email - Parks and Rec API", // Subject line
							html: `Hello!
                        <br>
                        Before continuing with your token, please confirm your email clicking <a href="${address}">here</a> or copying and pasting the following text to your browser address bar:
                        <br>
                        <span>${address}</span>`, // html body
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								res.json({ success: false });
								res.end();
								return console.log(error);
							}
							// console.log("Message sent: %s", info.messageId);
							// Preview only available when sending through an zoho account
							// console.log(
							// 	"Preview URL: %s",
							// 	nodemailer.getTestMessageUrl(info)
							// );

							res.json({ success: true, date: new Date() });
							res.end();
						});
					});
				})
				.catch((err) => {
					console.log(`Error! ${err}`);
					res.json(err);
				});
		});
	});
});

module.exports = router;
