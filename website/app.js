var express      = require("express");
var app          = express();
var passport     = require("passport");
var LocalStrategy = require("passport-local");
var bodyParser   = require("body-parser");
var mongoose     = require("mongoose");
var User         = require("./models/user");
var Form         = require("./models/form");
var Contact      = require("./models/contact");
var Data         = require("./models/data");
var Sub         = require("./models/sub");
var path         = require("path");
var nodemailer   = require('nodemailer');
var twilio       = require('twilio');


mongoose.connect("mongodb://localhost:27017/blood",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));




//app.use(express.static(path.join(__dirname,'public'))); 
app.use(express.static(__dirname + "/public2"));
//app.use(express.static(__dirname + "/public/consolution"));




//passport configuration
app.use(require("express-session")({
	secret: "vaccine for child",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

//simple landing page
app.get("/",function(req,res){
	res.render("zone");
});
//for form on landing page
app.post("/", function(req, res){
    var newForm = new Form({usname: req.body.usname , email: req.body.email , num: req.body.num ,message: req.body.message,category: req.body.category});
  Form.create(newForm,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{    
			res.redirect("/");
			console.log(newlyCreated);
//mail starts here
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'suryanshbhar@gmail.com',
    pass: ''//enter the password of your mail here
  }
});

var mailOptions = {
  from: 'suryanshbhar@gmail.com',
  to: newForm.email,
  subject: 'Thanks for your valuable feedback',
	  html: '<p>Dear '+newForm.usname+'</p><p>We at Teeka-Drive are very glad that you took out time to give us your valuable feedback.It would definitely be taken under consideration we will surely reach you back.</p><p>Thanks,<p>Teeka-Drive Team</p></p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
//mail ends here
		}
	});
});
			
			
//random redirecting
//app.get("/inlet",function(req,res){
//	res.render("dev");
//});
//


//auth routes
app.get("/register",function(req,res){
	res.render("index");
});
//handle sign up logic
/*app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username , email: req.body.email , name: req.body.name ,designation: req.body.designation });
	User.register(newUser,req.body.pass,function(err,user){
if(err){
	console.log(err);
	return res.render("index");
}*/
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username , email: req.body.email , name: req.body.name ,designation: req.body.designation });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("index");
        }
        passport.authenticate("local")(req, res, function(){
           res.render("prof",{newUser:newUser}); 
        });
    });
});
	//res.redirect('/');
	 //passport.authenticate("local")(req,res,function(){
	 //res.send("hello");	
	// res.redirect("/inlet");
	 //});
//show login form here
app.get("/login",function(req,res){
	res.render("Login");
});
//handling login logic
	app.post("/login",passport.authenticate("local",{
		successRedirect: "/dashboard",
		failureRedirect:"/login"
	}),function(req,res){

	});


//add logout route
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
//responsible for checking logged status
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
//making the contacts route
app.get("/contact",function(req,res){
	res.render("contact");
});
app.post("/contact", function(req, res){
    var newContact = new Contact({name: req.body.name , email: req.body.email ,message: req.body.message,subject: req.body.subject});
  Form.create(newContact,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/");
			console.log(newlyCreated);
//mail starts here
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'suryanshbhar@gmail.com',
    pass: ''//enter your password here
  }
});

var mailOptions = {
  from: 'suryanshbhar@gmail.com',
  to: 'suryanshbhar@gmail.com',
  subject: 'A user tried contacting us',
	  html: '<div>username: '+newContact.name+' </div>'+'<div>message: '+ newContact.message +' </div>'+'<div>email: '+newContact.email+' </div>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
//mail ends here
		}
	});
});
//page after login
app.get("/dashboard",function(req,res){
	res.render("prof");
});
app.post("/dashboard", function(req, res){
    var newSub = new Sub({name: req.body.name , email: req.body.email ,subject: req.body.subject,messages: req.body.messages});
  Sub.create(newSub,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			var twilio = require('twilio');
			var client = new twilio(accountSid, authToken);

			client.messages.create({
    		body: 'Hello from Node',
    		to: '+919899050644',  // Text this number
    		from: '+12056276653' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
			res.redirect("/dashboard");
			console.log(newlyCreated);
		}
	});
});

//dashboard ke aage
app.get("/front",function(req,res){
	res.render("form");
});
//backend
app.post("/front", function(req, res){
    var newData = new Data({child: req.body.child , date: req.body.date ,weight: req.body.weight,email: req.body.email,parent: req.body.parent,number: req.body.number,photo: req.body.photo});
  Data.create(newData,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.render("prof",{currentData: req.data});
			console.log(newlyCreated);
		}
	});
});


//for using the username and showing in our site
app.get("/yut",function(req,res){
	res.render("vac_lis");
})

var accountSid = 'AC30e577925a1b27324e34fea8e694cc28'; // Your Account SID from www.twilio.com/console
var authToken = 'd19b77b4a067dfe6e3331d77d3308e72';   // Your Auth Token from www.twilio.com/console



app.get("/admin",function(req,res){
	res.render("cmo");
});

app.get("/aefi",function(req,res){
	res.render("aefi");
});
	
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});