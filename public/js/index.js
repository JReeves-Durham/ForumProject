// Firebase config
var config = {
	apiKey: "AIzaSyDL_CrU-F1e98zpqAHC-TX1vTl55LWKVAk",
	authDomain: "forum-project-807e2.firebaseapp.com",
	databaseURL: "https://forum-project-807e2.firebaseio.com",
	projectId: "forum-project-807e2",
	storageBucket: "forum-project-807e2.appspot.com",
	messagingSenderId: "513223098966"
};
// Exporting for tests
module.exports = server

// Initialize Firebase
firebase.initializeApp(config);

// Get elements 
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const emailField = document.getElementById("loginEmailTxt");
const passwordField = document.getElementById("loginPasswordTxt");

const regEmailField = document.getElementById("registerEmailTxt");
const regPasswordField = document.getElementById("registerPasswordTxt");
const regConfirmPasswordField = document.getElementById("registerConfirmPasswordTxt");
const firstnameField = document.getElementById("registerFirstnameTxt");
const surnameField = document.getElementById("registerSurnameTxt");
const bioField = document.getElementById("registerBioField");
const emailLbl = document.getElementById("emailLbl");

const updateUserEmailField = document.getElementById("updateEmailField");
const updateUserPasswordField = document.getElementById("updatePasswordField");
const updateUserFirstnameField = document.getElementById("updateFirstnameField");
const updateUserSurnameField = document.getElementById("updateSurnameField");
const updateUserBioField = document.getElementById("updateBioField");

const loginButton = document.getElementById("loginBtn");
const logoutButton = document.getElementById("logoutBtn");
const registerButton = document.getElementById("registerBtn");
const registerModalButton = document.getElementById("registerModalBtn");
const loginModalButton = document.getElementById("loginModalBtn");

// Login Event
loginForm.addEventListener("submit", e => {
	e.preventDefault();

	// Get email and pass
	const email = emailField.value;
	const password = passwordField.value;
	const auth = firebase.auth();

	// Sign in 
	const promise = auth.signInWithEmailAndPassword(email, password);
	promise.catch(e => alert(e.message));
	promise.then( () => {
		$("#loginModal").modal("hide");

		var url = "http://localhost:5000/login";

		try {
			var data = {
				"username": email,
				"password": password
			};

			let response = fetch(url, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			});
			respData = response.JSON;
            
			if(!response.ok) {
				console.log(email);
				console.log(password);
				$("#userdetailsModal").modal("show");
				updateUserEmailField.value = email;
				updateUserEmailField.readOnly = true;
				updateUserPasswordField.value = password;
				updateUserPasswordField.readOnly = true;
			}

		} catch(e) {
			alert(e);
		}
	});
});

// Register Event
registerForm.addEventListener("submit", e => {
	e.preventDefault();

	// Get registration details
	const email = regEmailField.value;
	const firstname = firstnameField.value;
	const surname = surnameField.value;
	const bio = bioField.value;
	const password = regPasswordField.value;
	const passwordConfirm = regConfirmPasswordField.value;
	const auth = firebase.auth();

	if(!email || !firstname || !surname || !bio || !password || !passwordConfirm) {
		alert("Please fill in all fields");
	}
	else if(password != passwordConfirm) {
		alert("Passwords do not match");
	}
	else if(bio.length > 500) {
		alert("Biography cannot be more than 500 characters");
	}
	else if(password.length < 6) {
		alert("Password must be at least 6 characters long");
	}
	else {
		// Sign in
		const promise = auth.createUserAndRetrieveDataWithEmailAndPassword(email, password);
		promise.then( () => {
			$("#registerModal").modal("hide");
		});
		promise.catch(e => console.log(e.message));
		promise.catch(e => alert(e.message));

		try {
			var url = "http://localhost:5000/register";

			var data = {
				"email": email,
				"firstname": firstname,
				"surname": surname,
				"bio": bio,
				"password": password
			};

			let response = fetch(url, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if(!response.ok) {
				alert(response.status);
                
			}
		} catch(e) {
			alert(e);
		}
	} 
});

// Logout Event
logoutButton.addEventListener("click", e => {
	firebase.auth().signOut();
});

// Realtime listener 
firebase.auth().onAuthStateChanged(firebaseUser => {
	updatePosts();
    
	if(firebaseUser) {
		console.log(firebaseUser);
		logoutButton.style.display = "inline";
		loginModalButton.style.display = "none";
		registerModalButton.style.display = "none";
		emailLbl.style.display = "inline";
		updateLoggedInLabel();

	} else {
		console.log("Not logged in");
		logoutButton.style.display = "none";
		loginModalButton.style.display = "inline";
		registerModalButton.style.display = "inline";
		emailLbl.style.display = "none";
	}
});

// When the new-post form is submitted
document.getElementById("new-post").addEventListener("submit", async function(event) {
	event.preventDefault();
	var url = "http://localhost:5000/newpost";

	try {
		var data = {
			"email": firebase.auth().currentUser.email,
			"post_text": document.getElementById("postTxt").value
		};

		let response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		});
		respData = await response.JSON;

		if(!response.ok) {
			alert("Problem submitting post");
		}
		else {
			alert("Post submitted!");
			$("#postCollapse").collapse("hide");
			updatePosts();
		}
	} catch(e) {
		alert(e);
	}
});

// Checks whether the user is logged in before they can make a post
document.getElementById("postCollapseBtn").addEventListener("click", (event) => {
	console.log("hello");
	console.log(firebase.auth().currentUser);
	console.log(firebase.auth().currentUser);
	if (firebase.auth().currentUser) {
		$("#postCollapse").collapse("toggle");
	}
	else {
		$("#loginModal").modal("show");
	}
});

// Lets a user update their details if they have not yet made an account on the current server refresh
document.getElementById("userdetailsForm").addEventListener("submit", e => {
	e.preventDefault();

	// Get registration details
	const email = updateUserEmailField.value;
	const firstname = updateUserFirstnameField.value;
	const surname = updateUserSurnameField.value;
	const bio = updateUserBioField.value;
	const password = updateUserPasswordField.value;
	const auth = firebase.auth();

	if(!email || !firstname || !surname || !bio || !password) {
		alert("Please fill in all fields");
	}
	else if(bio.length > 500) {
		alert("Biography cannot be more than 500 characters");
	}
	else {
		try {
			var url = "http://localhost:5000/register";

			var data = {
				"email": email,
				"firstname": firstname,
				"surname": surname,
				"bio": bio,
			};

			let response = fetch(url, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			});

			$("#userdetailsModal").modal("hide");

		} catch(e) {
			console.log(e);
		}
	} 
});

// Used to display new posts
function updatePosts() {
	var url = "http://localhost:5000/posts";
	try {
		var data = "";
		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				var data = JSON.stringify(myJson);
				console.log(data);
				console.log(typeof(data));
				console.log(myJson);
				console.log(typeof(myJson));

				document.getElementById("userPosts").innerHTML = "";
				for(var i = 0; i < myJson.length; i++) {
					document.getElementById("userPosts").innerHTML += 
                "<div class=\"card text-center\" style=\"padding: 0px 50px 25px 50px \">\
                    <div class=\"card-header\">\
                        " + myJson[i].email + "\
                    </div>\
                    <div class=\"card-body\">\
                        <p class=\"card-text\">" + myJson[i].post_text + "</p>\
                    </div>\
                    <div class=\"card-footer text-muted\">\
                        Time: " + myJson[i].time_posted + "\
                        Date: " + myJson[i].date_posted + "\
                    </div>\
                </div>";
				}
			});
	} catch(e) {
		console.log(e);
	}
} 