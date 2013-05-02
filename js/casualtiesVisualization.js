/**********************************************************************************************************************
 * CSCI-E 64 / CS171 - Visualization
 * Harvard University
 * Spring 2013
 *
 * PROJECT 3: The Isle of Man TT
 *
 * CS171 Project 3, Team Data Visualization for the Isle of Man TT
 *
 * Team Members:
 *     David Killeffer <rayden7@gmail.com>
 *     Leo Mejia <kolopaisa@gmail.com>
 *
 * GitHub repo: https://github.com/rayden7/cs171-project03
 *
 **********************************************************************************************************************/



window.onload = function() {




    var w = 500;
    var h = 450;
    var barPadding = 2;

    var newDataset = [];
    var newDataset2 = [];
    var newDataset3 = [];

    var svg = d3.select("viz")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
        ;

    var svg2 = d3.select("viz")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
        ;


    var svg3 = d3.select("viz")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
        ;
    var padding = 30;


d3.csv("csv/Death_riders_per_event.csv", function(error, data){
    data.forEach(function(d) {
        newDataset.push({
            DeathEvent: d.deathevent,
            NumRecords: +d.NumberOfDeadRiders
        });
    });

    var barScaleY = d3.scale.linear()
        .domain([0, d3.max(newDataset , function(d) { return d.NumRecords; })])
        .rangeRound([h - padding , padding]);

    var barScaleY2 = d3.scale.linear()
        .domain([d3.max(newDataset, function(d) { return d.NumRecords; }), 0])
        .rangeRound([  h - padding,padding]);

    var barYAxis = d3.svg.axis()
        .scale(barScaleY)
        .orient("left");


    var barScaleX = d3.scale.linear()
        .domain(
            [d3.min(newDataset, function(d){ return d.Experience; }),
                d3.max(newDataset, function(d){ return d.Experience;})])
        .range([padding, w ]);

    var barXAxis = d3.svg.axis()
        .scale(barScaleX)
        .orient("bottom");



    svg.selectAll("rect")
        .data(newDataset)
        .enter()
        .append("rect")
        .attr("fill", "teal")
        .attr("x", function(d,i){ return i*((w - padding)/ newDataset.length) + padding + 1 ; })
        .attr("y",function(d){return h - (barScaleY2(d.NumRecords));} )
        .attr("width", (w - padding) / newDataset.length - barPadding)
        .attr("height",  function(d){return barScaleY2(d.NumRecords) - padding;});

    svg.selectAll("text")
        .data(newDataset)
        .enter()
        .append("text")
        .text(function(d){  return d.DeathEvent; })
        .attr("x", function(d, i) { return i*((w - padding) / newDataset.length) + padding + 15; })
        .attr("y",function(d){ return  h - padding - 13 ;} )
        .attr("font-family", "sans-serif")
        .attr("font-size", "11x")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
//            .attr("transform", "rotate(-90)")

    ;


    svg.append("g")
        .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(barXAxis)
        .append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text("Number of Deaths Per Event.");

    svg.append("g")
        .attr("class", "axis rider-detail-graphs")
        .attr("transform", "translate(" +  padding + ", 0)")
        .call(barYAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -32)
        .attr("x", -(h/3)*2.5)
        .text("Death Per Event.");


});

d3.csv("csv/Deaths_grouped_by_years_of_experience.csv", function(error, data){
    data.forEach(function(d) {
        newDataset2.push({
            Experience: +d.experience,
            NumRecords: +d.numberOfDeathRiders
        });
    });


    var barScaleY = d3.scale.linear()
        .domain([0, d3.max(newDataset2 , function(d) { return d.NumRecords; })])
        .rangeRound([h - padding , padding]);


    var barScaleY2 = d3.scale.linear()
        .domain([d3.max(newDataset2, function(d) { return d.NumRecords; }), 0])
        .rangeRound([  h - padding,padding]);



    var barScaleX = d3.scale.linear()
        .domain(
            [d3.min(newDataset, function(d){ return d.Experience; }),
                d3.max(newDataset, function(d){ return d.Experience;})])
        .range([padding, w ]);

    var barXAxis = d3.svg.axis()
        .scale(barScaleX)
        .orient("bottom");

    var barYAxis = d3.svg.axis()
        .scale(barScaleY)
        .orient("left");

    svg2.selectAll("rect")
        .data(newDataset2)
        .enter()
        .append("rect")
        .attr("fill", "teal")
        .attr("x", function(d,i){ return i*((w - padding) / newDataset2.length) + padding + 1 ; })
        .attr("y",function(d){ return h - (barScaleY2(d.NumRecords));} )
        .attr("width", (w - padding) / newDataset2.length - barPadding)
        .attr("height",  function(d){return barScaleY2(d.NumRecords) - padding;});

    svg2.selectAll("text")
        .data(newDataset2)
        .enter()
        .append("text")
        .text(function(d){  return d.Experience; })
        .attr("x", function(d, i) { return i*((w - padding) / newDataset2.length) + padding + 15; })
        .attr("y",function(d){ return  h - padding + 15 ;} )
        .attr("font-family", "sans-serif")
        .attr("font-size", "11x")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    svg2.append("g")
        .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(barXAxis)
        .append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text("Years of experience at TT races");

    svg2.append("g")
        .attr("class", "axis rider-detail-graphs")
        .attr("transform", "translate(" +  padding + ", 0)")
        .call(barYAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -32)
        .attr("x", -(h/3)*2.5)
        .text("Number Race Class Wins");
});


d3.csv("csv/Death_riders_per_place.csv", function(error, data){
    data.forEach(function(d) {
        newDataset3.push({
            DeathPlace: d.deathPlace,
            NumRecords: +d.NumberOfDeadRiders
        });
    });


    newDataset3 = newDataset3.filter(function(d){return d.NumRecords > 1} );
    var barScaleY = d3.scale.linear()
        .domain([0, d3.max(newDataset3 , function(d) { return d.NumRecords; })])
        .rangeRound([h - padding , padding]);

    var barScaleY2 = d3.scale.linear()
        .domain([d3.max(newDataset3, function(d) { return d.NumRecords; }), 0])
        .rangeRound([  h - padding,padding]);

    var barYAxis = d3.svg.axis()
        .scale(barScaleY)
        .orient("left");

    var barScaleX = d3.scale.linear()
        .domain(
            [d3.min(newDataset3, function(d){ return d.Experience; }),
                d3.max(newDataset3 , function(d){ return d.Experience;})])
        .range([padding, w ]);

    var barXAxis = d3.svg.axis()
        .scale(barScaleX)
        .orient("bottom");


    svg3.selectAll("rect")
        .data(newDataset3)
        .enter()
        .append("rect")
        .attr("fill", "teal")
        .attr("x", function(d,i){
            return i*((w - padding) / newDataset3.length) + padding + 1 ; })
        .attr("y",function(d){ return h - (barScaleY2(d.NumRecords));} )
        .attr("width", (w - padding) / newDataset3.length - barPadding)
        .attr("height",  function(d){return barScaleY2(d.NumRecords) - padding;});

    svg3.selectAll("text")

        .attr("transform", function(d) { return "rotate(-65)" })
        .data(newDataset3)

        .enter()
        .append("text").text(function(d){  return d.DeathPlace; })

        .attr("x", function(d, i) { return i*((w - padding) / newDataset3.length) + padding + 15; })
        .attr("y",function(d){ return  h - padding - 13 ;} )

        .attr("font-family", "sans-serif")
        .attr("font-size", "11x")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", "black")

//            .attr("transform", function(d) { return "rotate(-65)" })

    ;

    svg3.append("g")
        .attr("class", "axis rider-detail-graphs")  //Assign "axis" class
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(barXAxis)
        .append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text("Number of Deaths Per Place.");


    svg3.append("g")
        .attr("class", "axis rider-detail-graphs")
        .attr("transform", "translate(" +  padding + ", 0)")
        .call(barYAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -32)
        .attr("x", -(h/3)*2.5)
        .text("Number of Death by Place");
});


}
