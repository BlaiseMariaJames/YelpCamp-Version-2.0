<div id="user-content-toc">
  <ul>
    <summary><h1 style="display: inline-block;">Update History</h1></summary>
  </ul>
</div>

## Quick Glance

#### By Version:

<ul>
<li><a href="#Colt">Colt Steele (Yelpcamp v1)</a></li>
</ul>

#### By Month:

<ul>
<li><a href="#Feb23">February 2023</a></li>
<li><a href="#Jan23">January 2023</a></li>
<li><a href="#Oct22">October 2022 (Yelpcamp v1)</a></li>
<li><a href="#Sep22">September 2022</a></li>
<li><a href="#Aug22">August 2022</a></li>
</ul>

#### By Type:

<ul>
<li><a href="#Search-Filter">Search & Filter</a></li>
<li><a href="#Email-ForgotPassword">Email & Forgot Password</a></li>
<li><a href="#User-Profile">User Profile</a></li>
<li><a href="#Sort-AvgRating">Sort & Average Rating</a></li>
<li><a href="#Categories-Pagination">Categories & Pagination</a></li>
<li><a href="#Initial-v2">Initial v2</a></li>
<li><a href="#Seed-Database">Seed Database (Yelpcamp v1)</a></li>
<li><a href="#Deployment">Deployment</a></li>
<li><a href="#Security">Security</a></li>
<li><a href="#Styles-CleanUp">Styles CleanUp</a></li>
<li><a href="#Map-Upload">Map Upload</a></li>
<li><a href="#Image-Upload">Image Upload</a></li>
<li><a href="#Revamp">Revamp</a></li>
<li><a href="#Star-Rating">Star Rating</a></li>
<li><a href="#Refactoring">Refactoring</a></li>
<li><a href="#Authorization">Authorization</a></li>
<li><a href="#Authentication">Authentication</a></li>
<li><a href="#Restructuring">Restructuring</a></li>
<li><a href="#ReviewCRUD">Review CRUD</a></li>
<li><a href="#Validations">Validations</a></li>
<li><a href="#Styles">Styles</a></li>
<li><a href="#CampgroundCRUD">Campground CRUD</a></li>
<li><a href="#Initial">Initial</a></li>
</ul>

<h2 id="Feb23">February 2023</h2>

<h3 id="Search-Filter">Search & Filter Update 2.1.3V (Major Update)</h3>

1. Create Use My Location to support use my current location.
2. Modify Campground controller, Add campgrounds to database file and Index view to support search and filter.
3. Create Filter schema, Search-Filter partial, Search & Filter middleware and Clear Distance to support search and filter.

<h3 id="Email-ForgotPassword">Email & Forgot Password Update 2.1.2V (Major Update)</h3>

1. Seperate Password schema logic from User schema.
2. Modify User controller to support sending emails.
3. Install send-grid node module to support sending emails.
4. Modify Bootstrap (client-side) and Change Password (server-side) validations.
5. Create Forgot and Reset Password views and routes to support forgot/reset password.
6. Modify all form passwords and create Hide-Show Password logic to support hide/show password.
   
<h2 id="Jan23">January 2023</h2>

<h3 id="User-Profile">User Profile Update 2.1.1V (Major Update)</h3>

1. Modify Add Camps to database, User models and Register view to enhance user password authentication.
2. Modify Profile view, Update Profile route, User controller and other middlewares to support create/edit user bio and profile photo.
   
### User Profile Update 2.1.0V

1. Add Edit Profile to Profile view to support editing user profile.
2. Create Update Profile route, Check If Valid Password and Change Password middlewares.
3. Modify Bootstrap validations, JOI User model validations to support validations while editing user profile.

### User Profile Update 2.0.9V (Major Update)

1. Modify Profile view and route to support user profile.
2. Style BoilerPlate layout, Navbar and NotFound partials. 
3. Modify Campground routes to enhance user authentication.
4. Modify Show, Index and Categories views to view campgrounds by user.
   
### User Profile Update 2.0.8V

1. Create Profile view and route to support user profile.
2. Modify Show, Index and Categories views to support user profile.
3. Modify User model and Register route to support username and fullname.
4. Modify Add camps to database, User controller to support user profile.
   
<h3 id="Sort-AvgRating">Sort & Average Rating Update 2.0.7V (Major Update)</h3>

1. Make changes to all input fields to have a consistent usage of quotes.
2. Modify Index view, Navbar partial and Campground controller to support explore campgrounds.

### Sort & Average Rating Update 2.0.6V

1. Add Sort Campgrounds script to support sorting.
2. Modify Index view and Campground controller to support sorting.

### Sort & Average Rating Update 2.0.5V

1. Modify Campground model to support average rating.
2. Modify Show, Index and Categories views to support average rating.
3. Modify Add camps to database, Campground controller and Helmet Configuration to support font-awesome average star ratings.

<h3 id="Categories-Pagination">Categories & Pagination Update 2.0.4V (Major Update)</h3>

1. Update to Bootstrap v5.3.
2. Modify New-Create routes and views to support categories.
3. Modify Edit-Update and Remove - routes and views to support categories.
4. Modify Show, Index and Categories - routes and views to support categories.

### Categories & Pagination Update 2.0.3V

1. Seperate Categories logic from Index.
2. Create Categories view and route to support categories.
3. Modify Index view and Campground controller to support categories and pagination.

### Categories & Pagination Update 2.0.2V

1. Modify Index view and Campground controller to support categories and pagination.
   
### Categories & Pagination Update 2.0.1V

1. Modify Joi and Campground Models to support categories.
2. Modify Add Campgrounds to Database file to improve interactivity with user. 
3. Modify Index view, BoilerPlate layout, Campground controller to support categories and pagination.

<h3 id="Initial-v2">Initial Commit - Yelpcamp v2</h3>

1. Modify README.md, package.json and Update History.
2. Modify HomePage and Footer views from Yelpcamp 2022 to 2023.

<hr>

<h3 id="Colt">Yelpcamp v1 - Colt Steele's Version</h3>

<p>Colt Steele's Version ends here...</p>

<hr>  

<h2 id="Oct22">October 2022</h2>

<h3 id="Seed-Database">Seed Database Update 1.4.0V</h3>

1. Install readline-sync to improve interactivity while seeding data.
2. Modify Add Campgrounds to Database file to improve interactivity with user. 
   
<h3 id="Deployment">Deployment Update 1.3.9V</h3>

1. Install connect-mongo to create MongoStore to replace MemoryStore.

<h3 id="Security">Security Update 1.3.8V (Major Update)</h3>

1. Install express-mongo-sanitize to avade Mongo Injection.
2. Modify views, install and configure helmet node module to secure YelpCamp by setting various HTTP headers.
3. Modify models and extend joi to support HTML sanitization using sanitize-html node module to prevent Cross Site Scripting (XSS).

<h3 id="Styles-CleanUp">Styles CleanUp Update 1.3.7V</h3>

1. Remove inline styles from all files and add controls to map.

### Styles CleanUp Update 1.3.6V

1. Style Home, Login and Register view.

<h3 id="Map-Upload">Map Upload Update 1.3.5V</h3>

1. Add cluster map to Index view.
2. Modify Campground Model to add virtual property 'popUpMarkup'.

### Map Upload Update 1.3.4V

1. Add campground map to Show view.
2. Modify Add Campgrounds to Database file to support maps and images upload. 

### Map Upload Update 1.3.3V

1. Install Map-Box node module and modify Campground Model to support geo-coding.
2. Update New view and Create route to store coordinates of a campground location.
3. Update Edit view and Update route to edit coordinates of a campground location.

<h3 id="Image-Upload">Image Upload Update 1.3.2V (Major Update)</h3>

1. Modify all views to support media queries.
2. Add Manage view and Redesign route to manage camground images. 
3. Modify Show and Index views to support managing of campground images.
4. Modify Edit and Remove views to update or delete campground (except for images).
5. Modify Campground Schema to support Image Schema virtual properties 'cardImage' and 'thumbnail'.

### Image Upload Update 1.3.1V

1. Update Index view and Add Campgrounds to Database file.
2. Update Show view to display multiple images using Bootstrap 5 carousel.
  
### Image Upload Update 1.3.0V

1. Install dotenv node module, create .env file to store confidential data.
2. Install node modules multer and cloudinary, and configure them to support image upload.
3. Update new view, create route and campground model to support image upload using cloudinary.

<h2 id="Sep22">September 2022</h2>

<h3 id="Revamp">Revamp Update 1.2.9V (Major Update)</h3>

1. Update all files and folders.

<h3 id="Star-Rating">Star Rating Update 1.2.8V</h3>

1. Add star ratings to show view.
   
<h3 id="Refactoring">Refactoring Update 1.2.7V</h3>

1. Add controllers and refactor routes of all models.

<h3 id="Authorization">Authorization Update 1.2.6V</h3>

1. Add middleware function to authorize a user to delete a review.
2. Modify Review joi schema and mongoose schema to associate Review Model to User Model.
3. Modify Review delete route and Campground Show view to authorize the user by using middlware function. 

### Authorization Update 1.2.5V

1. Add middleware function to authorize a user to edit or delete a campground.
2. Modify Campground edit and delete routes to authorize the user by using middlware function.

### Authorization Update 1.2.4V

1. Modify Campground routes and views to associate Campground Model to User Model.
2. Modify Add Camps to Database to associate default campgrounds to a default user.
3. Modify Campground joi schema and mongoose schema to associate Campground Model to User Model.

<h3 id="Authentication">Authentication Update 1.2.3V</h3>

1. Define middleware functions to login or logout an user.
2. Modify routes to add protection by authenticating an user.
3. Modify Navbar partial to support login, register and logout of an user. 

### Authentication Update 1.2.2V

1. Create Login route and view.
2. Create Register route and view.

### Authentication Update 1.2.1V

1. Install passport, passport-local, passport-local-mongoose node modules.
2. Define mongoose schema, joi schema and create User Model.
3. Modify YelpCamp to configure passport on User Model.

<h3 id="Restructuring">Restructuring Update 1.2.0V (Major Update)</h3>

1. Install connect-flash node module.
2. Add Flash partial to show success and error messages to user.
3. Modify models, routes, views, layout and YelpCamp to support Flash.

### Restructuring Update 1.1.9V

1. Seperate Campground and Review based routes from YelpCamp.
2. Install express-session node module and configure sessions.
3. Seperate BootStrap Form Validations from boilerplate layout.

<h3 id="ReviewCRUD">Review CRUD Update 1.1.8V</h3>

1. Add Create and Delete routes for Review Model.
2. Modify boilerplate layout to set minimum width of web page.
3. Modify Show view to support creating, viewing and deleting of reviews.
4. Modify Campground Schema to support deleting of models associated with Campground.

### Review CRUD Update 1.1.7V

1. Remove legacy code from YelpCamp.
2. Define mongoose schema and joi schema for Review Model.
3. Establish one-to-many relationship between Campground and Review Model.

<h3 id="Validations">Validations Update 1.1.6V</h3>

1. Install joi node module and Define joi Campground Schema.
2. Modify YelpCamp to support Error Handling using joi schema validations.

### Validations Update 1.1.5V (Major Update)

1. Install morgan node module.
2. Create utilities folder and Add files.
3. Modify YelpCamp to support Error Handling.
4. Modify Add Camps to Database and Campground Schema.
5. Modify All views and Update PageNotFound to ErrorPage view.

### Validations Update 1.1.4V

1. Modify New and Edit views.
2. Modify boilerplate layout.
3. Add Bootstrap client side form validations.

<h2 id="Aug22">August 2022</h2>

<h3 id="Styles">Styles Update 1.1.3V</h3>

1. Style Show and Remove views.
   
### Styles Update 1.1.2V

1. Modify Update route to support Images.
2. Style New and Edit views.

### Styles Update 1.1.1V

1. Modify boilerplate layout and footer partial.
2. Style Index, HomePage and PageNotFound views.

### Styles Update 1.1.0V

1. Add (Seed) image url and description into database.
2. Modify Campground Schema and Show view to support Images.

### Styles Update 1.0.9V

1. Create footer using BootStrap classes.
2. Create footer partial and add it to boilerplate layout.

### Styles Update 1.0.8V

1. Create navbar using BootStrap classes.
2. Create navbar partial and add it to boilerplate layout.

### Styles Update 1.0.7V

1. Install ejs-mate node module along with BootStrap 5.
2. Create boilerplate layout and add it to every view.
   
<h3 id="CampgroundCRUD">Campground CRUD Update 1.0.6V</h3>

1. Create Remove view.
2. Modify Index and Show views.
3. Simplify Show and Edit routes.
4. Listen to the Server at Remove and Delete routes.

### Campground CRUD Update 1.0.5V

1. Create Edit view.
2. Modify Index and Show views.
3. Listen to the Server at Edit and Update routes.

### Campground CRUD Update 1.0.4V

1. Create New view.
2. Modify Campground Schema and Index view.
3. Listen to the Server at New and Create routes.

### Campground CRUD Update 1.0.3V

1. Create Index view.
2. Create Show view.
3. Modify HomePage and PageNotFound views.
4. Listen to the Server at Index and Show routes.

### Campground CRUD Update 1.0.2V

1. Define Campground Schema and Create Campground Model.
2. Add (Seed) Campground data into Database. 

### Campground CRUD Update 1.0.1V

1. Require Node Modules Express, Ejs and Mongoose.
2. Setup the Server, HTTP Verbs, View Engine and Paths.
3. Connect to MongoDB using Mongoose.
4. Listen to the Server at Home Route and any other route.

<h3 id="Initial">Initial Commit</h3>

1. Initialize Git and NPM.
2. Install node modules.
3. Create folders and files.