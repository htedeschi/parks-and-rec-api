require("dotenv").config();
const PORT = process.env.PORT || 5000;

const ejs = require("ejs");
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const mongo_options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const api_v1_Characters = require("./api/v1/characters");
const api_v1_Seasons = require("./api/v1/seasons");
const api_v1_Episodes = require("./api/v1/episodes");
// const api_v2_Characters = require("./api/v2/characters");
// const vouchersRoute = require("./routes/vouchers");

// Middleware
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use("/api/v1/characters", api_v1_Characters);
app.use("/api/v1/seasons", api_v1_Seasons);
app.use("/api/v1/episodes", api_v1_Episodes);
// app.use("/api/v2/characters", api_v2_Characters);
// app.use("/vouchers", vouchersRoute);

// Listen to port {PORT}
app.listen(PORT, function () {
	console.log("Listening on port " + PORT);
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, mongo_options)
	.then(() => {
		console.log(`Connected to DB!`);
	})
	.catch((err) => {
		console.log(`Error occurred! ${err}`);
	});

// Routes
app.get("/", function (req, res) {
	res.render("index");
	res.end();
});
