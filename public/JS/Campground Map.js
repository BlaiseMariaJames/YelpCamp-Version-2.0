// REQUIRING MAPBOX ACCESS TOKEN AND CAMPGROUND FROM SHOW PAGE EJS FILE
mapboxgl.accessToken = mapboxToken;
campground = JSON.parse(campground);

// MAPBOX CAMPGROUND MAP
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: campground.geometry.coordinates,
    zoom: 11
});

// MAPBOX DEFAULT MARKER WITH POPUP ADDED TO CAMPGROUND MAP
const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div style='margin-top:10px;text-align:center;' class='card'><div class='card-header'><h6>${campground.title}</h6></div><div class='card-body'><p class='card-text text-muted'>${campground.location}</p></div></div>`)
    )
    .addTo(map);