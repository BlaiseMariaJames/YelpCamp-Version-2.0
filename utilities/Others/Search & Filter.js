// CONFIGURING MAPBOX GEOCODING
const mapboxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapboxGeoCoding({ accessToken: mapboxToken });

// REQUIRING APPLICATION ERROR HANDLER CLASS 
const ApplicationError = require("../Error Handling/Application Error Handler Class.js");

// REQUIRING FILTER SCHEMA
const FilterSchema = require("../../models/Joi Models/Filter Model.js");

// DEFINING REGEX ESCAPE FUNCTION TO ESCAPE SPECIAL CHARACTERS
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string.
}

// DEFINING MIDDLEWARE FUNCTION THAT ADDS VARIOUS MONGODB QUERIES BASED ON VARIOUS KEYS PRESENT IN THE SEARCH QUERY
async function searchAndFilter(request, response, next) {
    // Extract keys from query object and store them in an array.
    const queryKeys = Object.keys(request.query);
    const allQueryKeys = ['find', 'user', 'select', 'page', 'limit', 'search', 'price', 'avgRating', 'location', 'distance'];
    for (let key of queryKeys) {
        if (!allQueryKeys.includes(key)) {
            // ERROR HANDLED: SEARCH QUERY DOESN'T EXISTS
            return next(new ApplicationError("Sorry!, Invalid Search Query. We couldn't find the campgrounds!!", 'Invalid Search Query', 400));
        }
    }
    // If queryKeys array length is greater than 1, the user has submitted the search and filter form.
    if (queryKeys.length) {
        // // To use search and filter, user must be logged in.
        const dbQueries = [];
        // Destructure all possible keys from query object.
        let { search, price, avgRating, location, distance } = request.query;
        const { error } = FilterSchema.validate({ search, price, avgRating, location, distance });
        if (error) {
            // ERROR HANDLED : Campgrounds not filtered due to invalid Search/Filter value. 
            let errorMessage = error.details.map(error => error.message).join(',');
            return next(new ApplicationError(errorMessage, "Invalid Search/Filter Value", 400));
        }
        // If there is a search key.
        if (search) {
            search = escapeRegExp(search);
            dbQueries.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } }
                ]
            });
        }
        // If there is a location key. 
        if (location) {
            let coordinates;
            try {
                location = JSON.parse(location);
                coordinates = location;
            } catch (err) {
                const response = await geoCoder
                    .forwardGeocode({
                        query: location,
                        limit: 1
                    })
                    .send();
                coordinates = response.body.features[0].geometry.coordinates;
            }
            let maxDistance = distance || 25;
            maxDistance *= 1609.34; // convert the distance to meters.
            dbQueries.push({
                geometry: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates
                        },
                        $maxDistance: maxDistance
                    }
                }
            });
        }
        // If there is a price key.
        if (price) {
            if (price.min) dbQueries.push({ price: { $gte: price.min } });
            if (price.max) dbQueries.push({ price: { $lte: price.max } });
        }
        // If there is a average rating key.
        if (avgRating) {
            dbQueries.push({ avgRating: { $gte: avgRating } })
        }
        // Add dbQuery to response.locals.
        response.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
    }
    // Add query to response.locals.
    response.locals.query = request.query;
    if (queryKeys.includes('page')) queryKeys.splice(queryKeys.indexOf('page'), 1);
    const delimiter = queryKeys.length ? '&' : '?';
    response.locals.paginateUrl = request.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
    next();
}

module.exports = searchAndFilter;