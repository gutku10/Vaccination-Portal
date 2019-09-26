var mongoose = require("mongoose");

var SubSchema = new mongoose.Schema({
	name: String,
	email: String,
	subject: String,
	messages: String
});




module.exports = mongoose.model("Sub",SubSchema);
