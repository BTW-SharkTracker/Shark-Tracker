# Shark-Tracker
Instructions for Use

- The project in its current iteration is live at: https://btw-sharktracker.github.io/Shark-Tracker/
- Preprocessing explaination: The preprocess.html file lets you select from your computer the shark tracks and shark metadata supplied by BTW, and then lets you download the processed files that we named ptswithin.geojson and lines.geojson. It is currently accessible at https://btw-sharktracker.github.io/Shark-Tracker/preprocess.html
Ptswithin is a feature collection of all the shark track points, merged together with the metadata for that shark, with the points that are on land removed using turf.js and an oceans.json file. Lines is a feature collection of line strings connecting each of the points from ptswithin.
- In previous iterations, we used the csv files directly (the metadata and tracks spreadsheets). However this made the reload time very slow. Instead, the above preprocessing steps were used to generate json files which the page uses. This means the preprocessing will only need run when there is new data.
- Our implementation allows the user to filter the tracks by species, zoom in and click on individual pings to get more information, and use the second view which is the lower half of the page to filter further. This view allows the user to brush over the tracks and filter the map to highlight the selected tracks. We were having a bit of difficulty getting this view to be either collapsible, or overlap with the map, but including that would help the overall appearance and ease of use of the page.
- We started the code to animate the tracks which has been commented out, but might be useful when trying to add this feature.
- In addition to using Mapbox GL JS, we also used d3 and turf to create the map/layers. Please use our implementation freely for any future iterations of this project!
