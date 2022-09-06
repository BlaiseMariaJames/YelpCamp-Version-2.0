<div id="user-content-toc">
  <ul>
    <summary><h1 style="display: inline-block;">Update History</h1></summary>
  </ul>
</div>

## Quick Glance

#### By Month:

<ul>
<li><a href="#Sep22">September 2022</a></li>
<li><a href="#Aug22">August 2022</a></li>
</ul>

#### By Type:

<ul>
<li><a href="#Restructuring">Restructuring</a></li>
<li><a href="#ReviewCRUD">Review CRUD</a></li>
<li><a href="#Validations">Validations</a></li>
<li><a href="#Styles">Styles</a></li>
<li><a href="#CampgroundCRUD">Campground CRUD</a></li>
<li><a href="#Initial">Initial</a></li>
</ul>

<h2 id="Sep22">September 2022</h2>

<h3 id="Restructuring">Restructuring Update 2.0V (Major Update)</h3>

1. Install connect-flash node module.
2. Add Flash partial to show success and error messages to user.
3. Modify models, routes, views, layout and YelpCamp to support Flash.

### Restructuring Update 1.9V

1. Seperate Campground and Review based routes from YelpCamp.
2. Install express-session node module and configure sessions.
3. Seperate BootStrap Form Validations from boilerplate layout.

<h3 id="ReviewCRUD">Review CRUD Update 1.8V</h3>

1. Add Create and Delete routes for Review Model.
2. Modify boilerplate layout to set minimum width of web page.
3. Modify Show view to support creating, viewing and deleting of reviews.
4. Modify Campground Schema to support deleting of models associated with Campground.

### Review CRUD Update 1.7V

1. Remove legacy code from YelpCamp.
2. Define mongoose schema and joi schema for Review Model.
3. Establish one-to-many relationship between Campground and Review Model.

<h3 id="Validations">Validations Update 1.6V</h3>

1. Install joi node module and Define joi Campground Schema.
2. Modify YelpCamp to support Error Handling using joi schema validations.

### Validations Update 1.5V (Major Update)

1. Install morgan node module.
2. Create utilities folder and Add files.
3. Modify YelpCamp to support Error Handling.
4. Modify Add Camps to Database and Campground Schema.
5. Modify All views and Update PageNotFound to ErrorPage view.

### Validations Update 1.4V

1. Modify New and Edit views.
2. Modify boilerplate layout.
3. Add Bootstrap client side form validations.

<h2 id="Aug22">August 2022</h2>

<h3 id="Styles">Styles Update 1.3V</h3>

1. Style Show and Remove views.
   
### Styles Update 1.2V

1. Modify Update route to support Images.
2. Style New and Edit views.

### Styles Update 1.1V

1. Modify boilerplate layout and footer partial.
2. Style Index, HomePage and PageNotFound views.

### Styles Update 1.0V

1. Add (Seed) image url and description into database.
2. Modify Campground Schema and Show view to support Images.

### Styles Update 0.9V

1. Create footer using BootStrap classes.
2. Create footer partial and add it to boilerplate layout.

### Styles Update 0.8V

1. Create navbar using BootStrap classes.
2. Create navbar partial and add it to boilerplate layout.

### Styles Update 0.7V

1. Install ejs-mate node module along with BootStrap 5.
2. Create boilerplate layout and add it to every view.
   
<h3 id="CampgroundCRUD">Campground CRUD Update 0.6V</h3>

1. Create Remove view.
2. Modify Index and Show views.
3. Simplify Show and Edit routes.
4. Listen to the Server at Remove and Delete routes.

### Campground CRUD Update 0.5V

1. Create Edit view.
2. Modify Index and Show views.
3. Listen to the Server at Edit and Update routes.

### Campground CRUD Update 0.4V

1. Create New view.
2. Modify Campground Schema and Index view.
3. Listen to the Server at New and Create routes.

### Campground CRUD Update 0.3V

1. Create Index view.
2. Create Show view.
3. Modify HomePage and PageNotFound views.
4. Listen to the Server at Index and Show routes.

### Campground CRUD Update 0.2V

1. Define Campground Schema and Create Campground Model.
2. Add (Seed) Campground data into Database. 

### Campground CRUD Update 0.1V

1. Require Node Modules Express, Ejs and Mongoose.
2. Setup the Server, HTTP Verbs, View Engine and Paths.
3. Connect to MongoDB using Mongoose.
4. Listen to the Server at Home Route and any other route.

<h3 id="Initial">Initial Commit</h3>

1. Initialize Git and NPM.
2. Install node modules.
3. Create folders and files.