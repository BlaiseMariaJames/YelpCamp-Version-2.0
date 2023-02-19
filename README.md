# Project YelpCamp Version 2.0

![HomePage](https://res.cloudinary.com/dtwgxcqkr/image/upload/bo_3px_solid_black/v1701283002/YelpCamp%20Related%20Media/Version-2-Media/d673bfxgbmerirrwgcsw.png)

**Welcome to YelpCamp Version 2.0**, expanded by drawing inspiration from **Ian Schoonover's Code w/ Node course**. This exciting project allows you to share your camping experiences with the world. YelpCamp is a full-stack web application built using Node.js, Express, MongoDB, and other technologies, and it is a part of **Colt Steele's The Web Developer Bootcamp 2023** on Udemy.

**The Website is now live! Check out now :** https://blaise-maria-james-yelpcamp-version-2.onrender.com

**Project Demonstration video :** https://bit.ly/Tutorial-Video-on-Yelpcamp-Version-2

## Overview

![IndexPage](https://res.cloudinary.com/dtwgxcqkr/image/upload/bo_3px_solid_black/v1701283152/YelpCamp%20Related%20Media/Version-2-Media/d8s0yhtv6rdvtxwv1mzl.png)

YelpCamp is a web application that allows users to create, view, and review campgrounds. Users can sign up, create their own campgrounds, leave reviews on other campgrounds, and more.

This version of YelpCamp is built on top of my **[Colt Steele's Version](https://github.com/BlaiseMariaJames/YelpCamp/tree/colt-steele)**. It includes all the features Colt introduced in his course, as well as new exciting features such as campground categories, pagination, sorting, average rating, searching, filtering, and a forgot/reset password mechanism with an email, introduced by Ian in his course.

## Technologies Used

The YelpCamp project is built using several technologies, including:

- **Node.js:** A server-side JavaScript environment that allows us to build fast, scalable applications.
- **Express:** A web application framework for Node.js that provides a set of features for web and mobile applications.
- **MongoDB:** A NoSQL database that stores data in a document-oriented format.
- **Bootstrap:** A popular CSS framework that provides pre-designed UI components.
- **Cloudinary:** A cloud-based image and video management service that allows us to store and serve images.
- **Passport:** A popular authentication middleware for Node.js.
- **SendGrid:** A cloud-based email platform that enables businesses to efficiently send and manage email communications.

## What's New?

![ProfilePage](https://res.cloudinary.com/dtwgxcqkr/image/upload/bo_3px_solid_black/v1701283152/YelpCamp%20Related%20Media/Version-2-Media/evoxp1kqt1dxpdupssga.png)

The YelpCamp version 2.0 project has several new exciting features, including:

#### Categories and Pagination

- Categorize campgrounds by type, location, amenities, and activities.
- Implement pagination for an enhanced visual experience.

#### Sorting and Average Rating

- Enable sorting of campgrounds by title, location, price, and display average ratings.

#### User Profile

- Create a user profile with a username, password, name, profile photo, email, and bio.
- Allow users to edit their name, profile photo, and bio at any time.
- Provide the option for users to change their password.

#### Email and Forgot Password

- Send email notifications for user registration, login, profile updates, and password changes.
- Support the "forgot password" feature, allowing users to reset their password.

#### Enhanced Authentication and Styles

- Strengthen authentication by enforcing traditional username and password conditions.
- Enhance styling using Bootstrap and Flex for an improved user interface.

#### Search and Filter

- Implement a search feature for campgrounds based on title, location, and description.
- Allow users to filter campgrounds by location (distance or user current location), price (min, max), and average rating.

### Key Differences:

<div align="center">

|               New Features               |         Version 1.0        |      Current Version     |
| :--------------------------------------: | :------------------------: | :----------------------: |
|      ***Categories and Pagination***     |  :heavy_multiplication_x:  |    :heavy_check_mark:    |
|     ***Sorting and Average Rating***     |  :heavy_multiplication_x:  |    :heavy_check_mark:    |
|           ***User Profiles***            |  :heavy_multiplication_x:  |    :heavy_check_mark:    |
|     ***Email and Forgot Password***      |  :heavy_multiplication_x:  |    :heavy_check_mark:    |
| ***Enhanced Authentication and Styles*** |  :heavy_multiplication_x:  |    :heavy_check_mark:    |
|         ***Search and Filter***          |  :heavy_multiplication_x:  |    :heavy_check_mark:    |

</div>

## Getting Yelpcamp Version 2.0

![CategoriesPage](https://res.cloudinary.com/dtwgxcqkr/image/upload/bo_3px_solid_black/v1701283150/YelpCamp%20Related%20Media/Version-2-Media/uhpgmahj3xcsawkcpfa7.png)

To get started with the YelpCamp version 2.0 project, you will need to have [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your computer.

You will also need a [Cloudinary account](https://cloudinary.com/) to store images, a [SendGrid account](https://sendgrid.com/en-us) to send emails, and a [Mapbox account](https://www.mapbox.com/) to render maps.

You can clone the current version of the project from the [GitHub repository](https://github.com/BlaiseMariaJames/YelpCamp/tree/main) and install the necessary dependencies by running the following commands:

```
git clone https://github.com/BlaiseMariaJames/YelpCamp.git
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

Your sendgrid account key (Required):

```
SENDGRID_KEY='<your_sendgrid_account_key>'
```

Your fontawesome kit (Required):

```
FONTAWESOME='<your_fontawesome_kit>'
```

Your mongoDB atlas URL (Optional):

```
ATLAS_DATABASE_URL='<your_database_url>'
```

With mongod running behind, now you can start the application by running the following command:

```
npm start
```

You can then access the application by opening your web browser and navigating to http://localhost:8888/.