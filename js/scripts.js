// JavaScript for Beneath the Waves Shark Tracker
// Map code
// Authors: Alexis and Felix


// Access Token: should probably be changed
mapboxgl.accessToken = 'pk.eyJ1IjoiYWczNzEzYSIsImEiOiJjazd1aG04MnUxYjU2M25rNWh5Nng2NmN6In0.4HUpNtdZx3kHM-dY4YY3GQ';
var filterGroup = document.getElementById('filter-group');

// Initialize map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-55.101826, 30.855898],
    zoom: 3,
    minZoom: 3,
    maxZoom: 12
});

// Popup that says loading...
var loading = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([-55.101826, 30.855898])
    .setHTML('<p>Loading...</p><div class="loader"></div>')
    .addTo(map);

var canvas = map.getCanvasContainer();

// Array to hold points selected by brushing
var brushedPts = ["any", ["==","pointID", 0]];
// Declare popup pointID variable
var popupPt;
// Declare popup variable
let popup =new mapboxgl.Popup();


//code for menu





// Promise.all([
//     d3.json('data/ptsWithin.geojson')])
// .then(ready);

// function ready(data) {
//     console.log(data[0]);
//     var animIterator = 0;
//     var animPts = data[0];

//     function animate() {
//         var coordinates;
//         if (animPts.features[animIterator].properties["Shark ID"] == "106744") {
//             coordinates = animPts.features[animIterator].geometry.coordinates;
//             animIterator++;
//         } else {
//             animIterator = 0;
//             coordinates = animPts.features[animIterator].geometry.coordinates;
//             animIterator++;
//         }
//         return {
//             'type': 'Point',
//             'coordinates': coordinates
//         };
//     }

    map.on('load', function() {

        // Close the loading popup
        doneLoading();
        function doneLoading() {
            loading.remove();
        }

        // map.addSource('point', {
        //     'type': 'geojson',
        //     'data': animate()
        // });

        // // Load shark image
        // map.loadImage(
        //     'img/shark.png',
        //     function(error, image) {
        //         if (error) throw error;
        //     map.addImage('shark', image);
        //     }
        // );

        // map.addLayer({
        //     'id': 'point',
        //     'source': 'point',
        //     'type': 'circle',
        //     'paint': {
        //         'circle-radius': 10,
        //         'circle-color': '#007cbf'
        //     }
        // });

        // Add sources
        // Shark meta and points from preprocess.html
        map.addSource('Sharks', {
            'type':'geojson',
            'data': 'data/ptsWithin.geojson'
        });

        // Bathymetry data
        map.addSource('10m-bathymetry-81bsvj', {
            type: 'vector',
            url: 'mapbox://mapbox.9tm8dx88'
        });

        // Lines data from preprocess.html
        map.addSource('lines', {
                type: 'geojson',
                data: 'data/lines.geojson'
        });

        //         // Test layer for shark icons
        // map.addLayer({
        //     'id': 'pgtest',
        //     'type': 'symbol',
        //     'source': 'point',
        //     'layout': {
        //         'icon-image': 'shark',
        //         'icon-size': 0.3
        //     }
        // });

        // map.addLayer({
        //     'id': 'animLines',
        //     'type': 'line',
        //     'source': 'lines',
        //     'layout': {
        //         'line-join': 'round',
        //         'line-cap': 'round'
        //     },
        //     'paint': {
        //         'line-color':"red",
        //         'line-width': 1,
        //     },
        //     "filter": ["==", "Shark ID","106744"]
        // });

        // Add bathymetry layer
        map.addLayer(
        {
            'id': '10m-bathymetry-81bsvj',
            'type': 'fill',
            'source': '10m-bathymetry-81bsvj',
            'source-layer': '10m-bathymetry-81bsvj',
            'paint': {
            'fill-outline-color': 'hsla(337, 82%, 62%, 0)',
            'fill-color': [
                'interpolate',
                ['cubic-bezier', 0, 0.5, 1, 0.5],
                ['get', 'DEPTH'],
                200,
                    '#002c47',
                    9000,
                    '#00131f'
                ]
            }
        },
        'land-structure-polygon'
        );

        // Add lines for prionace glauca
        map.addLayer({
            'id': 'pgLines',
            'type': 'line',
            'source': 'lines',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color':"#003165",
                'line-width': 1,
            },
            "filter": ["==", "Species","Prionace glauca"]
        });

        // Add points for prionace glauca
        map.addLayer({
            'id': 'pg',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                    3, 2,
                    6, 4,
                ],
                'circle-color': '#1f77b4'},
                // filter out points based on data quality
                "filter":["all", ["==","Species","Prionace glauca"],
                    ["any",
                    ["==","Class","0"],
                    ["==","Class","1"],
                    ["==","Class","2"],
                    ["==","Class","3"]]]
        });

        // Add lines for Isurus oxyrinchus
        map.addLayer({
            'id': 'ioxLines',
            'type': 'line',
            'source': 'lines',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color':"#9F3100",
                'line-width': 1,
            },
            "filter": ["==", "Species","Isurus oxyrinchus"]
        });

        // Add points for Isurus oxyrinchus
        map.addLayer({
            'id': 'iox',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
                3, 2,
                6, 4,
            ],
                'circle-color': '#ff7f0e'},
                //filter out points based on data quality
                "filter":["all", ["==","Species","Isurus oxyrinchus"],
                    ["any",
                    ["==","Class","0"],
                    ["==","Class","1"],
                    ["==","Class","2"],
                    ["==","Class","3"]]]
        });

        // Add lines for Lamna nasus
        map.addLayer({
            'id': 'lnLines',
            'type': 'line',
            'source': 'lines',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color':"#005200",
                'line-width': 1,
            },
            "filter": ["==", "Species","Lamna nasus"]
        });

        // Add points for lamna nasus
        map.addLayer({
            'id': 'ln',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
                3, 2,
                6, 4,
            ],
                'circle-color': '#2ca02c'},
                //filter out points based on data quality
                "filter":["all", ["==","Species","Lamna nasus"],
                    ["any",
                    ["==","Class","0"],
                    ["==","Class","1"],
                    ["==","Class","2"],
                    ["==","Class","3"]]]
        });

        // Add lines for galeocerdo cuvier
        map.addLayer({
            'id': 'gcLines',
            'type': 'line',
            'source': 'lines',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color':"#780000",
                'line-width': 1,
            },
            "filter": ["==", "Species","Galeocerdo cuvier"]
        });

        // Add points for galeocerdo cuvier
        map.addLayer({
            'id': 'gc',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
                3, 2,
                6, 4,
            ],
                'circle-color': '#d62728'},
                //filter out points based on data quality
                "filter":["all", ["==","Species","Galeocerdo cuvier"],
                    ["any",
                    ["==","Class","A"],
                    ["==","Class","B"],
                    ["==","Class","0"],
                    ["==","Class","1"],
                    ["==","Class","2"],
                    ["==","Class","3"]]]
        });

        // Add lines for carcharhinus obscurus
        map.addLayer({
            'id': 'coLines',
            'type': 'line',
            'source': 'lines',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color':"#441E6D",
                'line-width': 1,
            },
            "filter": ["==", "Species","Carcharhinus obscurus"]
        });

        // Add points for carcharhinus obscurus
        map.addLayer({
            'id': 'co',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
                3, 2,
                6, 4,
            ],
            'circle-color': '#9467bd'},
            //filter out points based on data quality
                "filter":["all", ["==","Species","Carcharhinus obscurus"],
                    ["any",
                    ["==","Class","0"],
                    ["==","Class","1"],
                    ["==","Class","2"],
                    ["==","Class","3"]]]
        });

        // Layer to show points selected by brushing scatterplot
        map.addLayer({
            'id': 'brushed',
            'type': 'circle',
            'source': 'Sharks',
            'paint': {
                'circle-radius': 4,
                'circle-color': '#ffd300'},
                // Default filter that makes sure none show
                "filter":["any", ["==","pointID", 0]
            ]});

        // Checkbox and label for galeocerdo
        var inputGC = document.createElement('input');
        inputGC.type = 'checkbox';
        inputGC.id = "gcCheckBox";
        inputGC.checked = true;
        filterGroup.appendChild(inputGC);

        var labelGC = document.createElement('label');
        labelGC.setAttribute('for', "gcCheckBox");
        labelGC.textContent = "Tiger Shark (Galeocerdo cuvier)";
        filterGroup.appendChild(labelGC);

        // When the checkbox changes, update the visibility of the layer.
        inputGC.addEventListener('change', function(e) {
            map.setLayoutProperty(
                "gc",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
            map.setLayoutProperty(
                "gcLines",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
        });


        // Checkbox and label for lamna nasus
        var inputLN = document.createElement('input');
        inputLN.type = 'checkbox';
        inputLN.id = "lnCheckBox";
        inputLN.checked = true;
        filterGroup.appendChild(inputLN);

        var labelLN = document.createElement('label');
        labelLN.setAttribute('for', "lnCheckBox");
        labelLN.textContent = "Porbeagle Shark (Lamna nasus)";
        filterGroup.appendChild(labelLN);

        // When the checkbox changes, update the visibility of the layer.
        inputLN.addEventListener('change', function(e) {
            map.setLayoutProperty(
                "ln",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
            map.setLayoutProperty(
                "lnLines",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
        });

        // Checkbox and label for isurus
        var inputIOX = document.createElement('input');
        inputIOX.type = 'checkbox';
        inputIOX.id = "ioxCheckBox";
        inputIOX.checked = true;
        filterGroup.appendChild(inputIOX);

        var labelIOX = document.createElement('label');
        labelIOX.setAttribute('for', "ioxCheckBox");
        labelIOX.textContent = "Shortfin Mako Shark (Isurus oxyrinchus)";
        filterGroup.appendChild(labelIOX);

        // When the checkbox changes, update the visibility of the layer.
        inputIOX.addEventListener('change', function(e) {
            map.setLayoutProperty(
                "iox",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
            map.setLayoutProperty(
                "ioxLines",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
        });

        // Checkbox and label for carcharhinus
        var inputCO = document.createElement('input');
            inputCO.type = 'checkbox';
            inputCO.id = "coCheckBox";
            inputCO.checked = true;
            filterGroup.appendChild(inputCO);

        var labelCO = document.createElement('label');
            labelCO.setAttribute('for', "coCheckBox");
            labelCO.textContent = "Sandbar Shark (Carcharhinus obscurus)";
            filterGroup.appendChild(labelCO);

        // When the checkbox changes, update the visibility of the layer.
        inputCO.addEventListener('change', function(e) {
            map.setLayoutProperty(
                "co",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
            map.setLayoutProperty(
                "coLines",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
        });

        // Checkbox and label for prionace
        var inputpg = document.createElement('input');
        inputpg.type = 'checkbox';
        inputpg.id = "pgCheckBox";
        inputpg.checked = true;
        filterGroup.appendChild(inputpg);

        var labelpg = document.createElement('label');
        labelpg.setAttribute('for', "pgCheckBox");
        labelpg.textContent = "Blue Shark (Prionace glauca)";
        filterGroup.appendChild(labelpg);

        // When the checkbox changes, update the visibility of the layer.
        inputpg.addEventListener('change', function(e) {
            map.setLayoutProperty(
                "pg",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
            map.setLayoutProperty(
                "pgLines",
                'visibility',
                e.target.checked ? 'visible' : 'none'
            );
        });
        document.getElementById("colorSquares").style.visibility = "visible";


        //generate pop-up when a node is clicked on
        map.on('click', function (e) {
            var bbox = [
                [e.point.x - 5, e.point.y - 5],
                [e.point.x + 5, e.point.y + 5]
            ];

            var features = map.queryRenderedFeatures(bbox, { layers: ['pg', 'iox', 'gc', 'co', 'ln'] });

            if (!features.length) {
                return;
            }

            var feature = features[0];
            // Set popupPt equal to selected pointID
            popupPt = feature.properties.pointID;
            popup
                .setLngLat(feature.geometry.coordinates)
                .setHTML('<h3><p>' +feature.properties['Name']+"</h3> "+"<h4>Common Name:</h4>"+feature.properties['CommonName']+
                        "</p><h4>Species: </h4>"+feature.properties['Species']
                        +"<br/><h4>Date: </h4>"+feature.properties['Date'])
                .addTo(map);
            });

        // Change mouse pointer when near point
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ['pg','co','iox','gc','ln' ]});
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });

        // function animateMarker(p) {
        //     map.getSource('point').setData(animate());
        //     requestAnimationFrame(animateMarker);
        //     }
        //     animateMarker();
    });
// }

// Update brushed filter when called
function brushMap(){
    map.setFilter('brushed', brushedPts);
}
