var express = require("express");
var fs = require("fs");
var app = express();
var fetch = require("node-fetch");
var bodyParser = require("body-parser");
var firebase = require("firebase");
var date = new Date();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

var port = 8090;

var users = [];
var posts = [];

// *** HTTP Methods *** 

// Loads the html page on root
app.get("/", (req, res) => {
	res.sendFile("public/views/index.html", {root: __dirname });
}); 

app.get("/users", function(req,resp){
	resp.send(users);
});

// Gets the object relating to a specific email
app.get("/users/:email", function(req, resp){
	var userIndex = findUser(req.params.email);
    
	if(userIndex == -1){
        resp.sendStatus(400).send("User not found")
	}else {
		resp.send(users[index]);
	}
});

// Gets all posts currently stored on the server
app.get("/posts", function(req, resp) {
	resp.send(posts);
});

// Gets all posts written by a certain user
app.get("/posts/:email", function(req, resp) {
	username = req.params.username;
	var userIndex = findUser(username);
	var userPosts = [];

	if(userIndex == -1) {
		resp.send("This user does not exist");
	} else {
		for(var i = 0; i < posts.length; i++) {
			if(posts[i].username == username) {
				userPosts.push(posts[i]);
			}
		}
	}
	resp.send(userPosts);
});

// Used to register a new user
app.post("/register", function(req,resp) {
	var user = {
		email: req.body.email,
		firstname: req.body.firstname,
		surname: req.body.surname,
		bio: req.body.bio
	};

	users.push(user);
	resp.send(true);
});

// Creates a new post object
app.post("/newpost", function(req, res) {
	datenow = (date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
	time = (date.getHours() + ":" + date.getMinutes());

	var newpost = {
		"email": req.body.email,
		"post_text": req.body.post_text,
		"date_posted": datenow,
		"time_posted": time
	};

	posts.push(newpost);
	res.send(true);
});

// Function that finds the index (ID) of a user
function findEmail(email) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].email == email) {
			return i;
		}
	}
	// Returns -1 if user not found
	return -1;
}

// Listener function for the app
app.listen(port, () => { 
	console.log(`Example app listening on port ${port}!`);
});

module.exports = app;