var mongoose = require("mongoose");


var FormSchema = new mongoose.Schema({
	usname: String,
	email: String,
	num:String,
	message:String,
	category:String,
});



module.exports = mongoose.model("Form",FormSchema);
