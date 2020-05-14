const mongoose = require("mongoose");

const Account = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: false,
	},
});

module.exports = mongoose.model("Account", Account);
