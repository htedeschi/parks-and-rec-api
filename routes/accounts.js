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
					html: `Hello!
                        <br>
						Here is your token:
						<br>
						<span style="max-width:200px;">${data.token}</span>
						<br>
						<br>
						Thank you.`, // html body
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

			const address = req.protocol + '://' + req.hostname + (req.app.settings.port ? ':' + req.app.settings.port : '') + '/accounts/confirm/' + data._id;

			// send email to confirm email
			nodemailer.createTestAccount((err, account) => {
				// setup email data with unicode symbols
				let mailOptions = {
					from: '"Parks and Rec API" <api@henriquetedeschi.com>', // sender address
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

module.exports = router;
