var mongoose = require("mongoose");


var FormSchema = new mongoose.Schema({
	name: String,
	email: String,
	message:String,
	subject:String,
});



module.exports = mongoose.model("Contact",FormSchema);
