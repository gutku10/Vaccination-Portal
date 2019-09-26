var mongoose = require("mongoose");


var DataSchema = new mongoose.Schema({
	child: String,
	date: String,
	weight:String,
	email:String,
	parent:String,
	number:String,
	photo:String
});



module.exports = mongoose.model("Data",DataSchema);
