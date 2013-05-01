///// declare the margins, width, and height for the PRIMARY race line visualization

// declare the margins, width, and height of the primary visualization area
//var margin = {top: 20, right: 20, bottom: 50, left: 50},
var margin = {top: 20, right: 20, bottom: 45, left: 45},
    width = 1050 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

///// declare the margins, width, and height for the TERTIARY RIDER INFO visualization(s)

// Avg. Speed / Year visualization margins, width, height
var margin2 = {
        top:    3,
        right:  (margin.right / 2),
        bottom: (margin.bottom / 1.5),
        left:   (margin.left / 1.5)
    },
    width2 = ((width / 2.85) - margin2.left - margin2.right),
    height2 = (175);

// Number of Times Rider Came In Each Position bar chart visualization margins, width, height
var margin3 = margin2; width3 = width2, height3 = height2;

// Number of Times Rider Came In Each Position visualization  margins, width, height
var margin4 = margin2, width4 = width2, height4 = height2;



// translate the X and Y positions to make it easier to draw to the primary visualization area
var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#viz")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var svg3 = d3.select("#viz")
    .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

var svg4 = d3.select("#viz")
    .append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
    .append("g")
    .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");


// later we will be appending rider race class race performance lines to this element
var g = d3.select("g");

// this will be for the first small sub-visualization below the main graph
var g2 = svg2.select("g");

// this will be for the second small sub-visualization below the main graph
var g3 = svg3.select("g");

// this will be for the third small sub-visualization below the main graph
var g4 = svg4.select("g");


window.onload = function(){
    drawGraphs();

}

function drawGraphs(){
    drawNumDeaths();

}

function drawNumDeaths() {
    // show the line graph of rider speed
    {
        var padding = 30;
        var w = width2;
        var h = height2;
        var numTicks = 0;
        if(d.length < 8){
            numTicks = d.length;
        }else numTicks = 8;

        var avgSpeedD = d.filter( function(d){ return d.Speed > 0 });
        // define the X-axis scale and Y-axis scale for the average speed line graph for an individually mouseed-over rider

        var lineScalex = d3.time.scale()
            .domain([d3.min(avgSpeedD, function(d){ return d.Year; }), d3.max(d, function(d){ return d.Year; })] )
            .range([padding, w ]);

        var lineXAxis = d3.svg.axis()
            .scale(lineScalex)
            .ticks(numTicks)
            .orient("bottom");

        // https://github.com/mbostock/d3/wiki/Time-Intervals#wiki-year
        //
        // d3.time.years(start, stop[, step])
        // Alias for d3.time.year.range. Returns the year boundaries (midnight January 1st) after or equal to start
        // and before stop. If step is specified, then every step'th year will be returned. For example, a
        // step of 5 will return 2010, 2015, 2020, etc.

        var lineScaley = d3.scale.linear()
            .domain([d3.min(avgSpeedD, function(d) { return d.Speed; }) - 10, d3.max(avgSpeedD, function(d) { return d.Speed; }) + 1])
            .range([h - padding, padding]);

        var lineScaleR =  d3.scale.linear()
            .domain( [72, 1] )
            .range([10, 4]);

        var lineYAxis = d3.svg.axis()
            .scale(lineScaley)
            .orient("left");

        svg2.selectAll("circle")
            .data(avgSpeedD)
            .enter()
            .append("circle")
            .attr("class", "rider-detail-graphs speed-circle")
            .attr("cy", function(d){ return lineScaley(d.Speed); })
            .attr("cx", function(d) { return lineScalex(d.Year); })
            .attr("r", function(d){ return lineScaleR(Math.ceil(d.Speed)); })
            .on("mouseover", circleMouseOver )
            .on("mouseout", circleMouseOut );

        // removing this text as the new tooltip represents the data much better.
        svg2.append("g")
            .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(lineXAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-2.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) { return "rotate(-65)" })
            .append("text")
            .attr("x", w / 2)
            .attr("y", 100)
            .style("text-anchor", "end")
            .text("Year");

        svg2.append("g")
            .attr("class", "axis rider-detail-graphs")
            .attr("transform", "translate(" +  padding + ", 0)")
            .call(lineYAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -32)
            .attr("x", -(h/3)*2)
            .text("Avg. Speed");
    }

    // show a bar chart indicating how many times the rider has finished in a given position for the
    // currently moused-over race class
    {
        var padding = 30;
        var w = width2 - padding;
        var h = height2;
        var barPadding = 2;

        var dGrouped = d3.nest()
            .key(function(d) { return d.Rider1; })
            .key(function(d) { return +d.Position}).sortKeys(d3.ascending)
            .rollup(function (d) {
                return {
                    Times: (d.length),
                    Name: d3.min(d, function(g) {return g.Rider1}),
                    Position: d3.min(d, function(g) {return +g.Position}),
                    Year: d3.min(d, function(g) {return g.Year})
                }
            })
            .entries(d);

        var barScaley = d3.scale.linear()
            .domain([0, d3.max(dGrouped[0].values, function(d) { return d.values.Times; })])
            .rangeRound([h - padding , padding]);

        var barScaley2 = d3.scale.linear()
            .domain([d3.max(dGrouped[0].values, function(d) { return d.values.Times; }), 0])
            .rangeRound([  h - padding,padding]);

        var barScalex = d3.scale.linear()
            .domain(
                [d3.min(dGrouped[0].values, function(d){ return d.Position; }),
                    d3.max(dGrouped[0].values, function(d){ return d.Position;})])
            .range([padding, w ]);

        var barXAxis = d3.svg.axis()
            .scale(barScalex)
            .orient("bottom");

        var barYAxis = d3.svg.axis()
            .scale(barScaley)
            .tickFormat(d3.format("d"))
            .orient("left");

        svg3.selectAll("rect")
            .data(dGrouped[0].values)
            .enter()
            .append("rect")
            .attr("x", function(d,i){ return i*((w - padding) / dGrouped[0].values.length) + padding + 1; })
            .attr("class", "rider-detail-graphs num-finishes-bars")
            .attr("y",function(d){ return  h -(barScaley2(d.values.Times)) ;} )
            .attr("width", (w  - (padding ))/ dGrouped[0].values.length - barPadding)
            .attr("height",  function(d){return barScaley2(d.values.Times) - padding ;});

        svg3.selectAll("text")
            .data(dGrouped[0].values)
            .enter()
            .append("text")
            .text(function(d){ if ( d.values.Position == 71 ) return "DNF"; else return +d.values.Position; })
            .attr("x", function(d, i) { return i*((w - padding) / dGrouped[0].values.length) + padding + 15; })
            .attr("y",function(d){ return  h - padding + 13 ;} )
            .attr("class", "rider-detail-graphs")

            .attr("font-family", "sans-serif")
            .attr("font-size", "11x")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("fill", "black");

        svg3.append("g")
            .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(barXAxis)
            .append("text")
            .attr("x", w / 2)
            .attr("y", 30)
            .style("text-anchor", "end")
            .text("Race Position");

        svg3.append("g")
            .attr("class", "axis rider-detail-graphs")
            .attr("transform", "translate(" +  padding + ", 0)")
            .call(barYAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -32)
            .attr("x", -(h/3)*2.5)
            .text("Number Race Class Wins");
    }

    // show a graph with dots corresponding to the rider's average speed for races where they placed in positions
    // 1-5; the relative size of the circle corresponds to their fastest lap speed
    {
        // filter out records from the dataset to only include race records where the rider came in 5th place or higher
        d = d.filter( function(d){ return d.Position <= 5 });

        // only show this graph if the rider has had one or more top 5 race finishes in the currently moused-over race line
        if (d.length > 0) {
            var padding = 30;
            var w = width2 - padding;
            var h = height2;

            var scatterScaleX = d3.time.scale()
                .domain([d3.min(d, function(d){ return d.Year; }), d3.max(d, function(d){ return d.Year; })] )
                .range([padding, w ]);

            var scatterScaleY = d3.scale.linear()
                .domain([5, 1])  // we only care about positions 1-5 for this chart
                .range([h - padding, padding]);

            var scatterScaleR =  d3.scale.linear()
                .domain( [d3.max(d, function(d){ return d.Speed; }), d3.min(d, function(d){ return d.Speed; })-50] )
                .range([15, 1]);

            var numTicks = d.length;
            var scatterXAxis = d3.svg.axis()
                .scale(scatterScaleX)
                .ticks(numTicks)
                .orient("bottom");

            var scatterYAxis = d3.svg.axis()
                .scale(scatterScaleY)
                .orient("left")
                .ticks(5);  // just show 5 years on the Y-axis

            svg4.selectAll("circle")
                .data(d)
                .enter()
                .append("circle")
                .attr("class", "rider-detail-graphs speed-circle")
                .attr("cy", function(d){ return scatterScaleY(d.Position); })
                .attr("cx", function(d) { return scatterScaleX(d.Year); })
                .attr("r", function(d){ return scatterScaleR(Math.ceil(d.Speed)); })
                .on("mouseover", circleMouseOver )
                .on("mouseout", circleMouseOut );

            // The text object below are no longer needed since the user now has the ability to mouse over the circle and see the same data.
            // With the added bonus that it now has a heading and it makes more sense.
            svg4.append("g")
                .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(scatterXAxis)
                .append("text")
                .attr("x", w / 2)
                .attr("y", 30)
                .style("text-anchor", "end")
                .text("Year");

            svg4.append("g")
                .attr("class", "axis rider-detail-graphs")
                .attr("transform", "translate(" +  padding + ", 0)")
                .call(scatterYAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -32)
                .attr("x", -(h/3)*2)
                .text("Race Position");
        }
    }
}