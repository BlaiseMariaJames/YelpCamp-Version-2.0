// REQUIRING MAPBOX ACCESS TOKEN AND CAMPGROUNDS FROM INDEX PAGE EJS FILE
mapboxgl.accessToken = mapboxToken;
campgrounds = JSON.parse(campgrounds);
campgrounds = { features: campgrounds };

// MAPBOX CLUSTER MAP
const map = new mapboxgl.Map({
    container: 'clusterMap',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-99.5917, 37.6699],
    zoom: 3
});

// MAP EVENT: ON PAGE LOAD
map.on('load', () => {

    // ADD SOURCE FROM CAMPGROUNDS
    map.addSource('campgrounds', {
        type: 'geojson',
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on.
        clusterRadius: 50 // Radius of each cluster when clustering points.
    });

    // ADD CLUSTERS
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                // Color of cluster, if less than 10 campgrounds.
                '#51bbd6',
                10,
                // Color of cluster, if less than 30 and more than 10 campgrounds.
                '#f1f075',
                30,
                // Color of cluster, if less than 60 and more than 30 campgrounds.
                '#efe6dd',
                60,
                // Color of cluster, if less than 120 and more than 60 campgrounds.
                '#e6ccbe',
                120,
                // Color of cluster, if less than 180 and more than 120 campgrounds.
                '#f28cb1',
                180,
                // Color of cluster, if more than 180 campgrounds.
                '#b388eb'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                // Size of cluster, if less than 10 campgrounds.
                15,
                10,
                // Size of cluster, if less than 30 and more than 10 campgrounds.
                18,
                30,
                // Size of cluster, if less than 60 and more than 30 campgrounds.
                21,
                60,
                // Size of cluster, if less than 120 and more than 60 campgrounds.
                24,
                120,
                // Size of cluster, if less than 180 and more than 120 campgrounds.
                27,
                180,
                // Size of cluster, if more than 180 campgrounds.
                30
            ]
        }
    });

    // ADD CLUSTER COUNTS
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    // ADD UNCLUSTERED POINTS
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#ff0000',
            'circle-radius': 6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // MAP EVENT: ON CLICKING CLUSTERS
    map.on('click', 'clusters', (event) => {
        const features = map.queryRenderedFeatures(event.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            (error, zoom) => {
                if (error) {
                    return;
                }
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // MAP EVENT: ON CLICKING UNCLUSTERED POINTS
    map.on('click', 'unclustered-point', (event) => {
        const coordinates = event.features[0].geometry.coordinates.slice();
        const popUpMarkup = event.features[0].properties.popUpMarkup;
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    });

    // MAP EVENT: MOUSE ON ENTERING CLUSTERS AND UNCLUSTERED POINTS
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // MAP EVENT: MOUSE ON LEAVING CLUSTERS AND UNCLUSTERED POINTS
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
    });
});

// ADD ZOOM AND ROTATION CONTROLS TO CLUSTER MAP
map.addControl(new mapboxgl.NavigationControl());