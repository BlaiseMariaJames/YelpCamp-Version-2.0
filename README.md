# Project YelpCamp (Colt Steele's Version)

![Colt-HomePage](https://res.cloudinary.com/dtwgxcqkr/image/upload/v1676777913/YelpCamp%20Related%20Media/Colt-Steele-Version-Media/Colt-HomePage_ladldw.png)

**Welcome to YelpCamp**, a project inspired from **Colt Steele's The Web Developer Bootcamp 2022** on Udemy. This is an exciting project where you can share your camping experiences with the world. This project is a full-stack web application built using Node.js, Express, MongoDB, and other technologies.

**The Website is now live! Check out now :** https://blaise-maria-james-yelpcamp-version-colt.onrender.com/

**Project Demonstration video :** https://bit.ly/Tutorial-Video-on-Yelpcamp-Version-Colt-Steele

## Overview

![Colt-IndexPage](https://res.cloudinary.com/dtwgxcqkr/image/upload/v1676777913/YelpCamp%20Related%20Media/Colt-Steele-Version-Media/Colt-IndexPage_jsvodp.png)

The YelpCamp project is a web application that allows users to create, view, and review campgrounds. Users can sign up, create their own campgrounds, leave reviews on other campgrounds, and more.

This version of YelpCamp, is created only by following the entire course. It includes all the features colt introduced in his course.

## Features

![Colt-ShowPage](https://res.cloudinary.com/dtwgxcqkr/image/upload/v1676777913/YelpCamp%20Related%20Media/Colt-Steele-Version-Media/Colt-ShowPage_hrxp0b.png)

The YelpCamp project has several exciting features, including:

- User authentication: Users can sign up, log in, and log out of the application.
- Campground creation: Users can create their own campgrounds and add details such as name, description, price, and images.
- Campground reviews: Users can leave reviews on other campgrounds, rating them on a scale of 1-5 stars.
- User profiles: Each user has their own profile where they can view and manage their campgrounds and reviews.

## Technologies Used

The YelpCamp project is built using several technologies, including:

- Node.js: A server-side JavaScript environment that allows us to build fast, scalable applications.
- Express: A web application framework for Node.js that provides a set of features for web and mobile applications.
- MongoDB: A NoSQL database that stores data in a document-oriented format.
- Bootstrap: A popular CSS framework that provides pre-designed UI components.
- Cloudinary: A cloud-based image and video management service that allows us to store and serve images.
- Passport: A popular authentication middleware for Node.js.

## Whats New?

Though this is based on top of Colt Steele's YelpCamp, it has a few add-ons.

#### 1. Redirect to same page on error

If any issues while submitting a form by a user, it will redirect the user to the same form rather than to an error page.

#### 2. Seperate route to manage images

Images can be uploaded or deleted by using a seperate user-friendly form and is now managed by seperate routes. 

#### 3. Get feedback for accurate location

Location provided by user can be revised using Mapbox geocoding for more precision.

#### 4. Improvised seeding of database

Seeding the database is now more interactive.

#### Key Differences:

<div align="center">

|             Add-on Features              |      Colt's Version      |  Current Version   |
| :--------------------------------------: | :----------------------: | :----------------: |
|   ***Redirect to same page on error***   | :heavy_multiplication_x: | :heavy_check_mark: |
|  ***Seperate route to manage images***   | :heavy_multiplication_x: | :heavy_check_mark: |
| ***Get feedback for accurate location*** | :heavy_multiplication_x: | :heavy_check_mark: |
|  ***Interactive seeding of database***   | :heavy_multiplication_x: | :heavy_check_mark: |

</div>

## Getting Yelpcamp

To get started with the YelpCamp project, you will need to have [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your computer. 

You will also need a [cloudinary account](https://cloudinary.com/) to store images and [mapbox account](https://www.mapbox.com/) to render maps.

You can clone the current version of the project from the [GitHub repository](https://github.com/BlaiseMariaJames/YelpCamp/tree/colt-steele) and install the necessary dependencies by running the following commands:

```
git clone -b colt-steele --single-branch https://github.com/BlaiseMariaJames/YelpCamp.git
cd YelpCamp
npm install
```

Once you have installed the dependencies, you have to create an .env file with the following environment variables:

Name and secret for Session (Optional):

```
SESSION_NAME='<your_session_name>'
SESSION_SECRET='<your_session_secret>'
```

Your cloudinary account credentials (Required):

```
CLOUDINARY_CLOUD_NAME='<your_cloudinary_account_name>'
CLOUDINARY_KEY='<your_cloudinary_account_key>'
CLOUDINARY_SECRET='<your_cloudinary_account_secret>'
```

Your mapbox account token (Required):

```
MAPBOX_TOKEN='<your_mapbox_token>'
```

Your mongoDB Atlas URL (Optional):

```
ATLAS_DATABASE_URL='<your_database_url>'
```

With mongod running behind, now you can start the application by running the following command:

```
node YelpCamp.js
```

You can then access the application by opening your web browser and navigating to http://localhost:8888/.