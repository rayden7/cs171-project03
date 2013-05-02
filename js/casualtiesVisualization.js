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

var w = 350;
var h = 225;
var barPadding = 3;
var newDataset = [];
var newDataset2 = [];
var newDataset3 = [];
var padding = 30;
var test = 0;


window.onload = function() {

    // rider deaths by race class
    d3.csv("csv/Death_riders_per_eventv2.csv", function(error, data){
        data.forEach(function(d) {
            newDataset.push({
                DeathEvent: d.deathevent,
                NumRecords: +d.NumberOfDeadRiders
            });
        });

        var chart = d3.select("#viz1").append("svg")
            .attr("class", "chart")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(100,35)") ;

        var x = d3.scale.linear()
            .domain([0, d3.max(newDataset , function(d) { return d.NumRecords;})])
            .range([0, w - (padding*3)-15]);

        var y = d3.scale.ordinal()
            .domain([ d3.min(newDataset , function(d) { return d.NumRecords;}), d3.max(newDataset , function(d) { return d.NumRecords;})])
            .rangeBands([0, 40]);


        chart.selectAll("rect")
            .data(newDataset)
            .enter().append("rect")
            .attr("y", function(d, i) { return i * y.rangeBand(d.NumRecords); })
            .attr("width", function(d){return x(d.NumRecords) ;})
            .attr("height", function(d){return y.rangeBand(d.NumRecords) -3;})   ;

        chart.selectAll("text")
            .data(newDataset)
            .enter().append("text")
            .attr("x", -4)
            .attr("y", function(d, i) { return i * y.rangeBand(d.NumRecords) + 10; })
            .attr("dx", -5) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "end") // text-align: right
            .text(function(d){return d.DeathEvent});


        chart.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", w / 2)
            .attr("y", -17)
            .style("text-anchor", "end")
            .text("Years of experience at TT races");

        chart.selectAll("line")
            .data(x.ticks(10))
            .enter().append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", 20 * newDataset.length)
            .style("stroke", "#ccc");

        chart.selectAll(".rule")
            .data(x.ticks(10))
            .enter().append("text")
            .attr("class", "rule")
            .attr("x", x)
            .attr("y", 0)
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(String);


        chart.append("line")
            .attr("y1", 0)
            .attr("y2", 20 * newDataset.length)
            .style("stroke", "#000");
    });


    // rider deaths by years of racing experience at the Isle of Man TT
    d3.csv("csv/Deaths_grouped_by_years_of_experiencev2.csv", function(error, data){
        data.forEach(function(d) {
            newDataset2.push({
                Experience: d.experience,
                NumRecords: +d.numberOfDeathRiders
            });
        });

        var chart = d3.select("#viz2").append("svg")
                .attr("class", "chart")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(100,35)");

        var x = d3.scale.linear()
            .domain([0, d3.max(newDataset2 , function(d) { return d.NumRecords;})])
            .range([0, w - (padding * 3)]);

        var y = d3.scale.ordinal()
            .domain([ d3.min(newDataset2 , function(d) { return d.NumRecords;}) , d3.max(newDataset2 , function(d) { return d.NumRecords;})])
            .rangeBands([0, 40]);


        chart.selectAll("rect")
            .data(newDataset2)
            .enter().append("rect")
            .attr("y", function(d, i) { return i * y.rangeBand(d.NumRecords); })
            .attr("width", function(d){return x(d.NumRecords);})
            .attr("height", function(d){return y.rangeBand(d.NumRecords) - 2;});


        chart.selectAll("text")
            .data(newDataset2)
            .enter().append("text")
            .attr("x", -3)
            .attr("y", function(d, i) { return i * y.rangeBand(d.NumRecords) + 5; })
            .attr("dx", -3) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "end") // text-align: right
            .text(function(d){return d.Experience});

        chart.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", w / 2)
            .attr("y", 0)
            .style("text-anchor", "end")
            .text("Years of experience at TT races");

        chart.selectAll("line")
            .data(x.ticks(10))
            .enter().append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", 20 * newDataset2.length)
            .style("stroke", "#ccc");

        chart.selectAll(".rule")
            .data(x.ticks(10))
            .enter().append("text")
            .attr("class", "rule")
            .attr("x", x)
            .attr("y", 0)
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(String);

        chart.append("line")
            .attr("y1", 0)
            .attr("y2", 20 * newDataset2.length)
            .style("stroke", "#000");
    });


    // rider deaths based on Snaefell Mountain Course location
    d3.csv("csv/Death_riders_per_location.csv", function(error, data){
        data.forEach(function(d) {
            newDataset3.push({
                DeathPlace: d.deathPlace,
                NumRecords: +d.NumberOfDeadRiders
            });
        });

        newDataset3 = newDataset3.filter(function(d){return d.NumRecords > 2} );

        var chart = d3.select("#viz3").append("svg")
            .attr("class", "chart")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(115,35)") ;

        var x = d3.scale.linear()
            .domain([0, d3.max(newDataset3 , function(d) { return d.NumRecords;})])
            .range([0, w - (padding * 3) - 30]);

        var y = d3.scale.ordinal()
            .domain([ d3.min(newDataset3 , function(d) { return d.NumRecords;}) , d3.max(newDataset3 , function(d) { return d.NumRecords;})])
            .rangeBands([0, 12]);

        chart.selectAll("rect")
            .data(newDataset3)
            .enter().append("rect")
            .attr("y", function(d,i){ return i*((h - padding) / newDataset3.length) ; })
            .attr("width", function(d){return x(d.NumRecords);})
            .attr("height", ((h - padding) / newDataset3.length) - barPadding) ;

        chart.selectAll("text")
            .data(newDataset3)
            .enter().append("text")
            .attr("x", -3)
            .attr("y", function(d,i){ return i*((h - padding) / newDataset3.length) + 5; })
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function(d){return d.DeathPlace});

        chart.selectAll("text")
            .data(data)
            .enter().append("text")
            .attr("x", w / 2)
            .attr("y", -17)
            .style("text-anchor", "end")
            .text("Years of experience at TT races");

        chart.selectAll("line")
            .data(x.ticks(6))
            .enter().append("line")
            .attr("x1", x )
            .attr("x2", x )
            .attr("y1", 0)
            .attr("y2", (20 * newDataset3.length))
            .style("stroke", "#ccc");

        chart.selectAll(".rule")
            .data(x.ticks(6))
            .enter().append("text")
            .attr("class", "rule")
            .attr("x", x)
            .attr("y", 0)
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(String);
        /*
         .append("text")
         .attr("x", w / 2)
         .attr("y", 30)
         .style("text-anchor", "end")
         .text("Years of experience at TT races");
         */
        chart.append("line")
            .attr("y1", 0)
            .attr("y2", 20 * newDataset3.length)
            .style("stroke", "#000");
    });

}




