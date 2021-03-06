"use strict";

const request = require("supertest");
const app = require("./server.js");

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise(obj){
	return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join("&");
}

// Testing the GET and POST requests for users (including register)
describe("Test the users", () => {
	test("GET /list succeeds", () => {
		return request(app)
	    .get("/users")
	    .expect(200);
	});

	test("GET /list returns JSON", () => {
		return request(app)
	    .get("/users")
	    .expect("Content-type", /json/);
	});

	test("POST /add works", () => {
	    const params = {
			email: "Testing@testing.co.uk",
			firstname: "Terry",
			surname: "Tester",
			bio: "I'm really great at testing things"
		};
		// add it to the list
		return request(app)
	    .post("/register")
	    .send(serialise(params)).expect(200);
	});
});

// Testing the GET and POST requests for the forum submissions
describe("Test the posts", () => {
	test("GET /list succeeds", () => {
		return request(app)
	    .get("/posts")
	    .expect(200);
	});

	test("GET /list returns JSON", () => {
		return request(app)
	    .get("/posts")
	    .expect("Content-type", /json/);
	});

	test("POST /add works", () => {
	    const params = {
			email: "MrTesty@Testing123.com",
			post_text: "whatever"
		};
		// add it to the list
		return request(app)
	    .post("/newpost")
	    .send(serialise(params)).expect(200);
	});
});