// Import ptsWithin
Promise.all([
    d3.json('/data/ptsWithin.geojson')])
.then(ready);

function ready(data) {

    // Initialize Variables
    var ptsWithin = data[0];
    var minDate = new Date (ptsWithin.features[0].properties.Date);
    var maxDate = new Date (ptsWithin.features[0].properties.Date);
    
    // Push all dates to x and set y to shark ID / name, check for min and max date
    var scatterPts = [];
    for (let iterator = 0; iterator < ptsWithin.features.length; iterator++) {
        var iteratorDate = new Date (ptsWithin.features[iterator].properties.Date);
        if (iteratorDate < minDate) {
            minDate = iteratorDate
        }
        if (iteratorDate > maxDate) {
            maxDate = iteratorDate
        }
        // Set color based on species
        switch (ptsWithin.features[iterator].properties.Species) {
            case "Prionace glauca":
                var speciesColor = "#1f77b4";
                break;
            case "Isurus oxyrinchus":
                var speciesColor = "#ff7f0e";
                break;
            case "Lamna nasus":
                var speciesColor = "#2ca02c";
                break;
            case "Galeocerdo cuvier":
                var speciesColor = "#d62728";
                break;
            case "Carcharhinus obscurus":
                var speciesColor = "#9467bd";
                break;
            default:
                var speciesColor = "#00000"
                break;
        }
        scatterPts.push({
            date: iteratorDate,
            name: ptsWithin.features[iterator].properties.Name,
            color: speciesColor,
            pointID: ptsWithin.features[iterator].properties.pointID
        })
    }

    // Size settings
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    width = window.innerWidth - margin.left - margin.right - 50,
    height = window.innerHeight - margin.top - margin.bottom -50;

    // X and Y Scales
    var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([10,width]);

    var yScale = d3.scalePoint()
        .domain(scatterPts.map(function(d) {return d.name}))
        .range([height-10, 0]);

    var xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);


    // Drawing Graph 
    var svg = d3.select("#scatterplot").append("svg")
            .attr("id", "scatterplot_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "x axis ")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);

    var dot = svg.selectAll(".dot")
        .data(scatterPts)
    .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function (d) { return xScale(d.date); })
        .attr("cy", function (d) { return yScale(d.name); })
        .attr("opacity", 0.7)
        .style("fill", function(d){return d.color;});
;

    // Brushing stuff
    svg.append("g")
    .call(d3.brush().extent([[0, 0], [width, height]]).on("brush", brushed).on("end", brushended));

    function brushed() {
        var s = d3.event.selection,
            x0 = s[0][0],
            y0 = s[0][1],
            dx = s[1][0] - x0,
            dy = s[1][1] - y0;

        svg.selectAll('circle')
            .style("fill", function (d) {
                if (xScale(d.date) >= x0 && xScale(d.date) <= x0 + dx && yScale(d.name) >= y0 && yScale(d.name) <= y0 + dy)
                    {
                    console.log(d.date);
                    // Add the point to the brushed point filter array
                    var currentBrushedPt = ["==","pointID", d.pointID];
                    brushedPts.push(currentBrushedPt);
                    return "#ffff00"; }
                else { return d.color }
            });
        // Call map updater
        brushMap();
    }

    function brushended() {
        if (!d3.event.selection) {
            svg.selectAll('circle')
            .transition()
            .duration(150)
            .ease(d3.easeLinear)
            .style("fill", function(d){return d.color;});
            // Clear the filter array
            brushedPts = ["any", ["==","pointID", 0]];
        }
        // Call map updaters
        brushMap();
    }

    // On map popup open: enlarge selected point on scatterplot
    popup.on('open', function(e) {
        svg.selectAll('circle')
            .attr("r", function(d) {
                if (d.pointID == popupPt)
                    {return 20;}
                else {return 5;}
            })
    });

    // On map popup close: return to normal
    popup.on('close', function(e) {
        svg.selectAll('circle')
            .attr("r", 5)
    });
}