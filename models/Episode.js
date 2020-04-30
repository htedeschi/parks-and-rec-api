const mongoose = require("mongoose");

const EpisodeSchema = mongoose.Schema({
	number_overall: {
		type: Number,
		required: true,
	},
	number_season: {
		type: Number,
		required: true,
	},
	title: {
		type: String,
		required: false,
	},
	directed_by: {
		type: String,
		required: false,
	},
	written_by: {
		type: String,
		required: false,
	},
	air_date: {
		type: Date,
		required: false,
	},
	viewers: {
		type: Number,
		required: false,
	},
});

module.exports = mongoose.model("Episode", EpisodeSchema);
