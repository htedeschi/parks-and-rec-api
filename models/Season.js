const mongoose = require("mongoose");
const Episode = require("./Episode");

const SeasonSchema = mongoose.Schema({
	season: {
		type: String,
		required: true,
	},
	episodes: {
		type: Number,
		required: true,
	},
	first_aired: {
		type: Date,
		required: false,
	},
	last_aired: {
		type: Date,
		required: false,
	},
	rank: {
		type: Number,
		required: false,
	},
	viewers: {
		type: Number,
		required: false,
	},
	episodes: {
		type: [Episode.schema],
		required: false,
	},
});

module.exports = mongoose.model("Season", SeasonSchema);
