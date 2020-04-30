const mongoose = require("mongoose");

const BandNameSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("BandName", BandNameSchema);
