# UBikER

  Bicycle parking finder for you, U BikER!
  Visit me at [UBikER](http://ubiker.danielbercht.com)

## About

  Motivation behind this was to facilitate the ways that cyclists can find parking spots nearest them.
  By having a general idea of who is parking where, cyclists can be well aware of where is the best place for them to park their bikes!

## Track

  The track chosen for this application was a full-stack. I am not a front-end engineer, so I apologize for the janky UI/UX. Just wanted to develop a full-stack application, but the focus should be the back-end code.

##Features

* User Registration
* Find closest parking slots (multiple), but default to closest one
* Users are able to rate parking slots
* Users are able to 'request' a parking slot. This means that a user can tell the system he will most likely be trying to park there. This allows the other users to have a general sense of how crowded the parking slot will be. A user can only have a SINGLE active request per parking slot. An active slot is any request made in the last 12 hours. Users can easily override their current request.
* On Sunny days and during cycling events in a city, there are ***'surge parking slot'*** status making cyclists pay for slots to keep the market with enough slots for everyone (just kidding).
* Users can select what type of parking spot to choose (Sidewalk, Garage, Racks, Parcel)

## Tools

### Backend: Node.js

  I am no Node ninja, but I've dabbled with Node before to develop prototypes of personal projects.
  If I had more time, I'd develop a backend on a language that lives on the JVM (like Scala) because of the predictability of the JVM.
  Node makes it easy to spin up prototypes, and for a full-stack track, it makes sense to keep a consistent language in the frontend/backend.
  I did not use an MVC pattern on the backend to avoid ORMs for the initial simplicity of the application.

### Frontend: AngularJS/Bootstrap

  Although the recommendation was not to use Angular, I decided to use it simply because I am not a front-end developer and Angular is the only tool for front-end I am comfortable with. But I still apologize for the monolothic code :/. It truly makes developing SPA easy, but I'm sure some strict front-end devs have a better opinion on its pros and cons. I've also developed prototypes on Angular or projects spun off from Angular such as [Ionic Framework](www.ionicframework.com).

### Database: Postgres

  Initially I considered using Mongo as a backend simply because it would've played nicely with a JSON backend talking to a JSON front end, living on a JS application. However, there was an extra feature of ratings/requests added to the application that would not have played well with Mongo. Being that Mongo is a document store, it does not necessarily scale well for volatile-sized documents that can grow because of space re-allocation.
  Postgres is relational, so it made sense to represent the relationships between parkingslots, requests, ratings, and users on a relational backend.

### Version Control: Git

  Gotta love git.

### Testing: mocha

  The backend is tested using mocha.
  To continuously run the backend code, simply run ```npm test``` to continuously watch your backend code for changes.
  The frontend does not contain any tests.

### Auth: Passport

  Utilized [passport-local](https://github.com/jaredhanson/passport-local) for the authentication. It's a node middleware that simplifies authenticating users. It would have been easy to implement 

## Features I wanted to add

### Socket/Social Media integration for real-time status

  It would have been nice if there was an option for users to communicate with other users about the parking slot's current situations. This could have been easily implemented with some kind of Web Socket (or simply a firebase backend to start off with).

### Single sign-on (FB, twitter, etc)

  Given the flexibilty of the passport middleware, this would have been a no-brainer. Just required creating an application on an external platform, gettinga client ID, and adding a couple of extra endpoints in the backend for OAuth, OpenID protocol.

### Users contribute to information

  It would have been nice if there was a feature to allow users to 'edit' biking slot information... I.e. # of racks, # of total spaces to park, parking slot status (Under Construction, etc).

## Downfalls

### UI/UX kind of ugly

  I think the UI/UX isn't horrible, but I'm sure there is a TON of improvements to be made.

### HTTP vs HTTPs

  The application has no SSL cert, so all data being passed between the frontend to the backend is vulnerable, including user email/password. Adding a cert would be trivial if provided the resources.

### No distributed cache

  If I had a larger server, I would have added a Redis node (cluster) to store user sessions and maybe cache some other information

### Users can't edit their 'profiles'

  There isn't much of a 'user profile', per se, but it'd be nice to have an 'edit profile' feature. There was no bandwidth or business pull to have that though.

### Retrieving slots based on "Geometric distance"

  The slots are retrieved based on the current user's Geometric distance, not the actual route's length, which might provide false results at times.

## API

#### GET /slots/{latitude};{longitutde}(?limit={limit}&radius={radius}&status{status}&placement={placement}

##### Params

* latitude: Float
* longitude: Float

##### Query

* limit: Int
* radius: Int -> Geometric mile radius of latitude/longitude
* status: ArrayString -> Status(es) of the parking slots, delimited by a comma. e.g. ACTIVE,INPROGRESS 
* placement: ArrayString -> Placement(s) of the parking slots, delimited by a comma. e.g. PARKING,SIDEWALK

##### Return
* 200 If quer/params valid
* 400 If query/params not valid

{ id, location, address, spaces, racks, latitude, longitude, placement, status, distance, rating, num _ ratings, pending _ requests, total _ requests }

If the user is loggedin, also return:
{ user _ rating, user _ requested }

#### GET /login
##### Return
* 200 If user is logged in
* 401 If User is not logged in

{ user: { username, email }}

#### POST /login
##### Body Params
* email: String
* password: String

##### Return
* 400 If bad/nonexisting combination
* 200 If success (returns GET /login)

#### POST /users
##### Body Params
* email : String
* username : String
* password : String

##### Return
* 201 If Created
* 400 If bad params
* 500 If email exists (A little hacky)

{}

#### POST /slots/{id}/ratings
##### Params
* id: Int

##### Body Params
* rating :Int [1 - 5]

##### Return
* 401 If User not authorized
* 201 If Created


#### POST /slots/{id}/requests
##### Params
* id: Int

##### Return
* 401 If User not authorized
* 201 If Created
