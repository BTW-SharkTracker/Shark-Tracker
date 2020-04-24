// JavaScript for Beneath the Waves Shark Tracker Preprocessor
// Authors: Alexis and Felix

// Declare variables
var tracks;
var meta;
var ptsWithin;
var lines;

// Display/hide loading animation, then display/hide download buttons and explainer
function toggleLoading() {
    var el = document.getElementById('loadingBox');
    var el2 = document.getElementById('downloadLines');
    var el3 = document.getElementById('downloadPoints');
    var el4 = document.getElementById('dlExplainer');
    if (el.style.display === "none") {
        el.style.display = "block";
    } else {
        el.style.display = "none";
        el2.style.display = "inline";
        el3.style.display = "inline";
        el4.style.display = "block";
    }
}

// Create filereader and read user inputted file to tracks variable
var readTracks = function(input) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
        var output = e.target.result;
        tracks = output;
        // If both variables are filled, call process
        if (meta && tracks) {
            process();
        }
    });
    reader.readAsDataURL(file);
}

// Create filereader and read user inputted file to meta variable
var readMeta = function(input) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
        var output = e.target.result;
        meta = output;
        // If both variables are filled, call process
        if (meta && tracks) {
            process();
        }
    });
    reader.readAsDataURL(file);
}

// All processing code
function process() {

    // Turn on animation
    toggleLoading();

    // Create lines feature collection
    lines = {
        "type":"FeatureCollection",
        "features": []
    };

    // Load in tracks, meta, and oceans with D3
    Promise.all([
            d3.csv(tracks),
            d3.csv(meta),
            d3.json('data/oceans.json')])
        .then(ready);

        function ready(data) {
            // Initialize variables
            var trackIterator;
            var trackPos;

            // Set variables to d3 promised data
            var nodes=data[0];
            var metaFC=data[1];
            var oceans=data[2];
            var nodeFeatures = [];
            // To give each point a unique ID
            var ptCounter = 0;
            // Merge shark points and meta data
            nodes.forEach(function(d){
                ptCounter++;
                    metaFC.forEach(function(e){
                        if (e["Shark ID"]==d["Shark ID"]){
                            sp=e["Species Name"];
                            commn=e["Commn Name"];
                            n=e["Name"];
                            tt=e["TagType"];
                            td=e["TagDay"];
                            ty=e["TagYear"];
                            tm=e["TagMonth"];
                            t=e["Total Length"];
                            s=e["Sex"];
                            m=e["Maturity"];
                            tc=e["Track Color"];
                            a=e["Active?"];
                            return sp,commn,n,tt,td,ty,tm,t,s,m,tc,a
                        }
                    });
                    var parts =d["Date"].split('/');
                    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
                    // January - 0, February - 1, etc.
                    var month=parts[0]-1;
                    var day=parts[1];
                    var year=parts[2];
                    d.day=day;
                    d.month=month;
                    d.year=year;
                    d.LatLng = [+d.Lat, +d.Lon];
                    d.Species=sp;
                    d.CommonName=commn;
                    d.Name=n;
                    d.TagType=tt;
                    d.TagDay=td;
                    d.TagMonth=tm;
                    d.Length=t;
                    d.Sex=s;
                    d.Maturity=m;
                    d.TrackColor=tc;
                    d.ActiveStatus=a;
                    d.pointID=ptCounter;

                    // Filter out points of bad quality
                    if (d.Class>=0){
                        nodeFeatures.push(turf.point([+d.Lon, +d.Lat], d));
                    }
                    else if (d.CommonName=='Tiger') {
                        nodeFeatures.push(turf.point([+d.Lon, +d.Lat], d));
                    }

            });

            // Turn into featurecollection
            nodeFeatures = turf.featureCollection(nodeFeatures);

            // Remove points that are not in the ocean
            ptsWithin = turf.pointsWithinPolygon(nodeFeatures, oceans);

            // Create lines
            for (trackIterator = 0; trackIterator < ptsWithin.features.length; trackIterator++) {
                if (trackIterator == 0) {
                    trackPos = 0;
                } else {
                        if (ptsWithin.features[trackIterator].properties["Shark ID"] == ptsWithin.features[trackIterator-1].properties["Shark ID"] ) {
                                lines.features.push({ "type": "Feature","geometry": {"type": "LineString","coordinates": []},"properties": {"Shark ID": null, "Date": null, "Date2": null, "Species Name": null, "month": null, "year": null}});
                                    lines.features[trackPos].geometry.coordinates.push(ptsWithin.features[trackIterator].geometry.coordinates);
                                    lines.features[trackPos].geometry.coordinates.push(ptsWithin.features[trackIterator-1].geometry.coordinates);
                                    lines.features[trackPos].properties["Shark ID"] = ptsWithin.features[trackIterator].properties["Shark ID"];
                                    lines.features[trackPos].properties["Species"] = ptsWithin.features[trackIterator].properties["Species"];
                                    lines.features[trackPos].properties["month"] = ptsWithin.features[trackIterator].properties["month"];
                                    lines.features[trackPos].properties["year"] = ptsWithin.features[trackIterator].properties["year"];
                                    lines.features[trackPos].properties.Date = ptsWithin.features[trackIterator-1].properties.Date;
                                    lines.features[trackPos].properties.Date2 = ptsWithin.features[trackIterator].properties.Date;
                                    trackPos++;
                    }
                }
            }

            // Turn off loading icon, show buttons and explainer
            toggleLoading();
        }
}

function dlLines() {
    download('lines.geojson', lines);
}

function dlPoints() {
    download('ptsWithin.geojson', ptsWithin);
}

// Turn file into json and download
function download(filename, file) {
    var element = document.createElement('a');
    var string = JSON.stringify(file);
    var uri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(string);
    element.setAttribute('href', uri);
    element.setAttribute('download', filename);
    element.click();
}