#Forum Project Documentation
 

## Explanation of the application
### Basic use
This application is designed to be a simple 'forum' type app. The user is able to log in and create an account on the website, and once they are logged in with a valid account are then able to make new text posts. These posts display the text body, the email of the account that posted them as well as the date and time when they were submitted. The posts diplsay using AJAX, so no refreshing is required to display any of the posts stored on the server. The application also uses Bootstrap for frontend design. The app also makes use of Google's API 'firebase' for external authentication and Heroku for cloud deployment. 


### Login system
The server locally stores user details in a JSON array. The application also uses the Google's API 'firebase' in order to allow users to login using their email and password, save sessions so that if they refresh they remain logged in etc. One of the restrictions of the project was that entity details (including the user) had to be stored locally and not on an external server, this presented a challenge ensuring that the user's details and the details stored on firebase's servers were matched. Essentially, any account created is permanently stored on firebase's servers (only the user's email and password) and every detail is stored locally. However the local JSON array is emptied each time a new session starts (the server resets). I created a system where if you login and you have not yet registered on that server session then you are provided an oppurtunity to fill in your user details. Details stored about the user are email, firstname, surname and biograpy.

### Post system
Posts are really simple, stored in a JSON array with the properties: email (of user who posted), text body, time posted and date posted. Similar to the user system, posts are lost on server reset due to being stored locally. When the GET request is called then the posts are displayed by iterating through a JSON array returned by the server and displaying using HTML. 

## API Explanation
### GET /posts
Returns the posts currently being stored in the JSON array on the server. Returns a JSON array
### GET /posts/:email
Returns the posts made by a user with the email supplied as the argument. Returns a JSON array if the user exists, otherwise a 400 http error code and the message 'User not found'
### GET /Users
Returns the JSON array of all the users currently registered in that instance of the server.
### Get /Users/:email
Returns the JSON array of the user corresponding to the email provided as an argument in the request
### POST /Register
Parameters include: email, password, firstname, surname and biography. The password is the only argument that is not stored on the server, instead handled by firebase authentication. This POST request responds 'true' if everything has gone well and adds a JSON object to the Users JSON array
### POST /NewPost
Parameters include: email, post_text. Time posted and date posted are supplied by the server when adding a new entity to the Posts JSON array. Returns true if everything goes alright