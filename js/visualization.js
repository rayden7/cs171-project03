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

// save the races dataset here, so that we can refer to it outside of the loading function
// (because d3.csv file loading is asynchronous and can cause the browser to hang when loading large files),
// and also so we can massage the data as it is loaded from the races_data.csv into the JavaScript datatypes
// we want to use (int, Date, etc.)
var dataset = [];

// for the same reason as we had for the dataset, save the rider information here (from rider-data.csv)
var riderDataset = [];


/*
 information on race classes, laps/miles, etc. comes from:

 http://www.iomguide.com/ttproduction.php
 http://www.iomguide.com/races/tt/tt-results.php
 http://www.iomguide.com/races/tt/tt-results.php?race=666
 http://www.iomtt.com/TT-2013.aspx
 http://www.iomtt.com/TT-2013/Practice-and-Race-Schedule.aspx
 http://www.iomtt.com/TT-2013/2012-TT-Results.aspx
 http://cdn.iomtt.com/~/media/Files/2012/Results/Championship-Standings/JoeyDunlopTrophyfinal.ashx
 */
var raceClasses = {
    // http://www.iomguide.com/ttformulaone.php
    // http://www.iomtt.com/TT-Database/Events/Races.aspx?meet_code=TT04&race_seq=1
    formulaone : {
        Class:"TT Formula One",
        Laps:4,
        DistanceMiles:150.92,
        FastestLapRider:"John McGuinness",
        AverageSpeed:125.38,
        Notes: "The TT Races is part of the TT Festival covering two weeks from the end of May to the beginning of June. The first week consists of practice racing with the second week being the main racing event. The TT (Tourist Trophy) Formula One Motorcycle Races was started in 1977. It used to cover 226.38 miles/364.2 km over 6 laps on the Mountain Circuit, but as of 2004 it has changed to 4 laps covering 150.92 miles.",
        Visible:true
    },
    // http://www.iomtt.com/TT-Database/TT-Records/Race-Records.aspx
    // http://www.iomtt.com/TT-Database/Events/Races.aspx?meet_code=TT2009&race_seq=4
    // http://www.iomguide.com/ttjunior.php
    junior : {
        Class:"TT Junior / Supersport TT",
        Laps:4,
        DistanceMiles:150.92,
        FastestLapRider:"Ian Hutchinson",
        AverageSpeed:124.141,
        Notes: "The TT Races is part of the TT Festival covering two weeks from the end of May to the beginning of June. The first week consists of practice racing with the second week being the main racing event. The TT (Tourist Trophy) Junior 600 and TT 250 Motorcycle Races covers 150.92 miles/ 242.8 km over 4 laps on the Mountain Circuit. The Junior Races are on Wednesday morning.",
        Visible:true
    },
    // http://cdn.iomtt.com/~/media/Files/2012/Results/Fast%20times%20-%20Lightweight%2026.5.ashx
    // http://www.iomguide.com/ttlightweight.php
    lightweight : {
        Class:"TT Lightweight",
        Laps:4,
        DistanceMiles:150.92,
        FastestLapRider:"Ryan Farquhar",
        AverageSpeed:113.587,
        Notes: "The TT Races is part of the TT Festival covering two weeks from the end of May to the beginning of June. The first week consists of practice racing with the second week being the main racing event. The TT (Tourist Trophy) Lightweight 400 and Ultra Lightweight 125 Motorcycle Races cover 150.92 miles/242.8 km over 4 laps on the Mountain Circuit. The Lightweight and Ultra Lightweight races are on Monday.",
        Visible:true
    },
    // http://www.iomguide.com/ttproduction.php
    // http://www.iomtt.com/TT-Database/Events/Races.aspx?meet_code=TT04&race_seq=5
    production : {
        Class:"TT Intnl. Production 1000",
        Laps:3,
        DistanceMiles:113.19,
        FastestLapRider:"Bruce Anstey",
        AverageSpeed:123.72,
        Notes: "The TT Races is part of the TT Festival covering two weeks from the end of May to the beginning of June. The first week consists of practice racing with the second week being the main racing event. The TT (Tourist Trophy) Production 600 and 1000 Motorcycle Races cover 113.19 miles/182.1 km over 3 laps on the Mountain Circuit. The Production 1000 race is on Monday and the Production 600 race on Friday.",
        Visible:true
    },
    // http://www.iomtt.com/TT-Database/TT-Records/Race-Records.aspx
    // http://www.iomguide.com/races/tt/senior-tt.php
    senior : {
        Class:"Senior TT",
        Laps:6,
        DistanceMiles:226.38,
        FastestLapRider:"John McGuiness",
        AverageSpeed:128.078,
        Notes: "A new race from 2005 with any machine eligible from TT Superbike, TT Superstock or Supersport Junior TT.",
        Visible:true
    },
    // http://www.iomtt.com/TT-Database/Events/Races.aspx?meet_code=TT00&race_seq=7
    // http://en.wikipedia.org/wiki/2000_Isle_of_Man_TT
    singles : {
        Class:"TT Singles",
        Laps:4,
        DistanceMiles:150.92,
        FastestLapRider:"John McGuinness",
        AverageSpeed:109.63,
        Notes: "",
        Visible:true
    },
    // http://cdn.iomtt.com/~/media/Files/2012/Results/020612/Superbike/Superbike%20-%20Lap%20by%20lap%20-%202.6.ashx
    // http://www.iomguide.com/races/tt/tt-superbike.php
    superbike : {
        Class:"TT Superbike",
        Laps:6,
        DistanceMiles:226.38,
        FastestLapRider:"Cameron Donald",
        AverageSpeed:130.258,
        Notes: "A new race from 2005 with machines complying with World Superbike and/or British Superbike specifications:\nOver 750cc up to 1000cc 4 cylinders\nOver 750cc up to 1000cc 3 cylinders\nOver 800cc up to 1000cc 2 cylinders",
        Visible:true
    },
    // http://www.iomguide.com/races/tt/tt-superstock.php
    // http://www.iomtt.com/TT-Database/Events/Races.aspx?meet_code=TT2012&race_seq=4
    superstock : {
        Class:"TT Superstock",
        Laps:4,
        DistanceMiles:150.8,
        FastestLapRider:"John McGuinness",
        AverageSpeed:126.657,
        Notes: "A new race from 2005 with machines complying with FIM Superstock and/or UEM Stocksport and/or MCRCB Stocksport specifications:\nOver 600cc up to 1000cc 4 cylinders\nOver 750cc up to 1000cc 3 cylinders\nOver 850cc up to 1200cc 2 cylinders",
        Visible:true
    },
    // http://www.iomtt.com/TT-2013/TT-Zero.aspx
    // http://www.iomguide.com/races/tt/ttxgp.php
    // www.iomtt.com/TT-Database/TT-Records/Race-Records.aspx
    zero : {
        Class:"TTXGP",
        Laps:1,
        DistanceMiles:37.7,
        FastestLapRider:"Michael Rutter",
        AverageSpeed:104.056,
        Notes: "The world's first clean emmissions race for motorcycles. The first one lap race is due to take place on June 12, 2009.",
        Visible:true
    }
};


// when a viewer clicks on a rider's race line, save the RiderID that was clicked so we 
// can preserve the ancillary data display (the rider info panel on the right, the lower 
// sub-visualizations, etc.)
var curClickedRiderID;

// when we display a rider's detailed information in the rider detail panel and in the graphs
// below, make a note of the riderID that is being displayed in those areas; this becomes
// important to preserve the currently "clicked"/"selected" rider's information until a new
// rider is clicked
var curDisplayedRiderID;


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



// execute the CSV load and generate the graph once the window has loaded
window.onload = function() {

    if (window.location.href.indexOf("index.html") > 0) {

        var x = d3.time.scale().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        // NOTE: we are initially declaring our X and Y axes because we want to use custom labels,
        // and we are intimately familiar with the dataset, so we know the ranges for each
        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues([
            new Date(1991,0), new Date(1992,0), new Date(1993,0), new Date(1994,0), new Date(1995,0),
            new Date(1996,0), new Date(1997,0), new Date(1998,0), new Date(1999,0), new Date(2000,0),
            new Date(2001,0), new Date(2002,0), new Date(2003,0), new Date(2004,0), new Date(2005,0),
            new Date(2006,0), new Date(2007,0), new Date(2008,0), new Date(2009,0), new Date(2010,0),
            new Date(2011,0), new Date(2012,0)
        ])
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickValues([1,2,3,4,5,6,7,8,9,10,12,14,16,18,20,24,28,32,36,40,44,48,52,56,60,64,68,70,71])
            .tickFormat(function(d) {
                if (isNaN(d)) {
                    return d.toString();
                } else {
                    return d;
                }
            })
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(d.Position); });

        var lineClosed = d3.svg.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(d.Position); })
            .defined(function(d){ return (d.x !== null && d.y !== null); });


        //****************************************************************************************************************//
        //                                                                                                                //
        // TT VIDEO LINK TO EXPLAIN WHAT THE ISLE OF MAN TT IS - SHOULD PUT IN PROCESS BOOK AND LINK FROM VISUALIZATION   //
        //      http://www.youtube.com/watch?feature=player_embedded&v=VOTvQuuQ7B4                                        //
        //                                                                                                                //
        //****************************************************************************************************************//


        /*
         * Because the different race names have overlaps (e.g., there are often several races of a given class in a
         * particular year, some races only offered in a single year, etc.) it is necessary to correlate a given race
         * with a particular "raceClass".  Because there were several splinterings of different race classes, often times
         * a given category of race would change, or there might be multiple variants of a given race in a given year,
         * both (or more) of which a competitor might have raced in.  This presents a problem in the visualization - an odd
         * vertical line banding occurs because it attempts to connect two different race classes in the same year to each
         * other.  To resolve this we restrict ourselves to the set of uniquely identified race classes mentioned below, and
         * we ensure that ONLY ONE of each race class occurs per year, so there is no chance for the weird vertical line
         * banding effect we had originally seen in some of our earlier visualization iterations.
         */
        var racesToExclude = [
            "TT 1999 Lightweight 400 TT Results",
            "TT 2000 Lightweight 400 TT Results",
            "TT 2002 IOM Steam Pckt 250cc Results",
            "TT 2002 Production 600 Results",
            "TT 2003 Production 600 Results",
            "TT 2004 Production 600 Results",
            "TT 2009 TTXGP Open Class Results",
            "TT 2005 IOMSPC Supersport Junior B Results",
            "TT 2006 IOMSPC Supersport Results",
            "TT 2006 IOMSPC Supersport Results",
            "TT 2007 Pokerstars Supersport TT Results",
            "TT 2008 Relentless Supersport Junior TT 2 Results",
            "TT 2009 Motorsport Merchandise Lightweight 250 TT #2 Results",
            "TT 2009 Motorsport Merchandise Ultra Lightweight 125 TT #2 Results"
        ];


        // load in the CSV of all the rider information data
        //d3.csv("csv/rider-data.csv", function(error, data) {
        d3.csv("csv/rider-data-with-casualties.csv", function(error, data) {
            data.forEach(function(d) {
                riderDataset.push({
                    RiderID: +d.RiderID, // parse the RiderID as a number
                    RiderName: d.RiderName,
                    TTDatabaseWebpage: d.TTDatabaseWebpage,
                    UPPERCASERider: d.UPPERCASERider,
                    Biography: d.Biography,
                    Picture1: d.Picture1,
                    Picture2: d.Picture2,
                    Picture3: d.Picture3,
                    Weight: +d.Weight, // parse rider weight as a number
                    Height: d.Height,
                    Website: d.Website,
                    // parse out all the frequencies of race placement as integer values
                    TTCareerSummaryPosition1: +d.TTCareerSummaryPosition1,
                    TTCareerSummaryPosition2: +d.TTCareerSummaryPosition2,
                    TTCareerSummaryPosition3: +d.TTCareerSummaryPosition3,
                    TTCareerSummaryPosition4: +d.TTCareerSummaryPosition4,
                    TTCareerSummaryPosition5: +d.TTCareerSummaryPosition5,
                    TTCareerSummaryPosition6: +d.TTCareerSummaryPosition6,
                    TTCareerSummaryPosition7: +d.TTCareerSummaryPosition7,
                    TTCareerSummaryPosition8: +d.TTCareerSummaryPosition8,
                    TTCareerSummaryPosition9: +d.TTCareerSummaryPosition9,
                    TTCareerSummaryPosition10: +d.TTCareerSummaryPosition10,
                    TTCareerSummaryPositionDNF: +d.TTCareerSummaryPositionDNF
                });
            });
        });


        // load in the CSV of all the races data
        d3.csv("csv/races_data.csv", function(error, data) {
            data.forEach(function(d) {
                /*
                 races to discard data for:

                 TT 1999 Lightweight 400 TT Results
                 TT 2000 Lightweight 400 TT Results
                 TT 2002 IOM Steam Pckt 250cc Results16
                 TT 2002 Production 600 Results
                 TT 2003 Production 600 Results
                 TT 2004 Production 600 Results
                 TT 2009 TTXGP Open Class Results
                 TT 2005 IOMSPC Supersport Junior B Results
                 TT 2008 Relentless Supersport Junior TT 2 Results
                 TT 2009 Motorsport Merchandise Lightweight 250 TT #2 Results
                 TT 2009 Motorsport Merchandise Ultra Lightweight 125 TT #2 Results
                 TT 2006 IOMSPC Supersport Results
                 TT 2007 Pokerstars Supersport TT Results

                 these races should be excluded because either they don't map well to one of the already-existing race
                 classes (e.g., maybe there are too many occurrences of this class of race in the given year, or the
                 race is not part of a longer-running, year-over-year series and so we can't show rider position placement
                 year-over-year, etc.
                 */
                // only add race data for the races not on the list of ones ot exlude
                if (racesToExclude.indexOf(d.RaceName) == -1) {
                    dataset.push({
                        RiderID: +d.RiderID,  // parse the RiderID as a number
                        RaceName: d.RaceName,
                        RaceType: d.RaceType,
                        Year: new Date(d.Year,0),  // parse the year into a Date object
                        Position: +d.Position, // parse the race Position as a number
                        BikeNumber: +d.BikeNumber,  // parse the BikeNumber as a number
                        Rider1: d.Rider1,
                        Rider2: d.Rider2,
                        Machine: d.Machine,
                        Time: d.Time,
                        Speed: +d.Speed, // parse the Speed as a number
                        RaceClass: getRaceClass(d.RaceName)  // get information about the main race this record is under
                    });
                }
            });


            //************************************************************************************************************//
            /**
             * SPECIAL CASE: "DID NOT FINISH" (a.k.a., "DNF") race position records
             *
             * For nearly all the races, there is a category of the rider's position called "DNF" (Did Not Finish).
             * For whatever reason, the rider did not complete the race (injury, mechanical failure, death, etc.).
             * In the cases where a rider's race record had a position value of "DNF", we need to assign it a place
             * that we can show on the graph.  Because we will not know the highest positional value until after we
             * have processed ALL the race records in the dataset, we cannot predict where the DNF records should appear
             * (we know at the "bottom" of the y-axis graph, just not how far down on the graph), after all the records
             * have been loaded into the "dataset" variable, any that have a "Position" attribute of "NaN" we know are
             * records that should be "DNF" (because when we coerced the Position attribute into an integer it would
             * fail for DNF records).
             *
             * Now we can get the maximum regular positional integer Y-value, we can assign "DNF" to be the next highest value.
             * Then, we can quickly iterate over all the records in "dataset" and assign the integer value for "DNF" to any
             * records that have Position equal to "NaN".
             *
             * Lastly, we will need to update the display of the Y-axis graph to include "DNF" as the label for the lowest row.
             *
             */
            var lastPlace = d3.max(dataset, function(d) { return d.Position; });
            var dnfPlace = lastPlace + 1;
            dataset.filter(function(d) { if (isNaN(d.Position)) { return d; }}).forEach(function(e) { e.Position = dnfPlace; });

            //********************************************************************************************************************//

            x.domain(d3.extent(dataset, function(d) { return d.Year; }));

            // go from last place (71st place is reserved for "DNF" - did not finish - records, all the way up to first place)
            y.domain([dnfPlace, 1]);


            // draw the X-axis indicating the year the races were held (note that in 2001 the TT was cancelled due to
            // the Foot & Mouth Disease outbreak (see: http://www.iomtt.com/TT-Database/Events.aspx?meet_code=TT01)
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("x", width / 2)
                .attr("y", 35)
                .attr("dx", ".71em")
                .style("text-anchor", "end")
                .text("Year");


            //************************************* draw the main visualization area *************************************//
            redrawRaceLines();


            // build out the primary race lines visualization by looping over all the race classes, filtering out each
            // class by rider and race type, and then draw all the race lines for the given class
            function redrawRaceLines() {

                // start by clearing all race lines from the graph in case any are present
                d3.selectAll("path").remove();

                // loop over each of the raceClasses, filter the dataset to get just riders in each class,
                // then draw all the race lines for the specified class
                for (var raceClass in raceClasses) {
                    // filter out each race and group them first by unique rider, then by race type, and finally,
                    // restrict the dataset to be only for that specified RaceClass
                    var raceClassRecords = d3.nest()
                        .key(function(d) { return d.Rider1; })    // group all the records for the individual Rider
                        .key(function(d) { return d.RaceType; })  // and further group the records for individual race classes
                        .entries( dataset.filter(function(d) { return d.RaceClass === raceClasses[raceClass] && raceClasses[raceClass].Visible; }) );

                    raceClassRecords.forEach(function(idx) {
                        idx.values.forEach(function(innerIdx) {
                            g.append("svg:path")
                                .datum( innerIdx.values )
                                .attr("class", "race-line "+innerIdx.key)
                                .attr("d", lineClosed)
                                .on("mouseover", raceLineMouseOver )
                                .on("mouseout", raceLineMouseOut )
                                .on("click", riderRaceLineClick );
                        });
                    });

                }

                d3.selectAll("text").remove();

                // draw the X-axis indicating the year the races were held (note that in 2001 the TT was cancelled due to
                // the Foot & Mouth Disease outbreak (see: http://www.iomtt.com/TT-Database/Events.aspx?meet_code=TT01)
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("x", width / 2)
                    .attr("y", 35)
                    .attr("dx", ".71em")
                    .style("text-anchor", "end")
                    .text("Year");

                // draw the Y-axis denoting race position, and also draw tick marks
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -40)
                    .attr("x", -(height / 2))
                    .attr("dy", ".71em")
                    .text("Race Position");

                yAxis.ticks(dnfPlace);
            }


            // RACE CLASS filtering
            $("#raceClassFilter ul li").click(function(e){
                // get the name of the currently selected race class
                var raceClassToFilter = this.children[0].id;

                // toggle the visibility of the currently selected race class
                raceClasses[raceClassToFilter].Visible = !raceClasses[raceClassToFilter].Visible;

                // toggle whether the current race class should be bolded or lightened
                $(this).toggleClass("unselectedClass");

                // dim the other race classes that aren't selected
                $("#raceClassFilter ul li").each(function(index){
                    if (this !== e.currentTarget && this.children[0] != null && typeof raceClasses[this.children[0].id] == "undefined" ) {
                        $(this).addClass("unselectedClass");
                    }
                });

                clearAllSelectedRiders();

                redrawRaceLines();
            });

        });

    }
}


// PHP's "nl2br()" equivalent in JavaScript - borrowed from:
//     http://stackoverflow.com/questions/7467840/nl2br-equivalent-in-javascript
// used to put breaks in for tooltip race class descriptions where appropriate
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

// show a tooltip when mousing over a race class with information on that race class;
// using "Tipsy" jQuery plugin: http://onehackoranother.com/projects/jquery/tipsy/#download
$("#raceClassFilter ul li").tipsy({
    fade: true,
    gravity: 'nw',
    html: true,
    opacity: 0.85,
    // build out the text to show on the TOOLTIP
    title: function(){
        var raceInfoHTML = "<ul>\n";
        raceInfoHTML += "<li><b>Class:</b> "+raceClasses[this.children[0].id].Class+"</li>\n";
        raceInfoHTML += "<li><b>Laps:</b> "+raceClasses[this.children[0].id].Laps+"</li>\n";
        raceInfoHTML += "<li><b>Total Distance:</b> "+raceClasses[this.children[0].id].DistanceMiles+" mi.</li>\n";
        raceInfoHTML += "<li><b>Fastest Lap Rider:</b> "+raceClasses[this.children[0].id].FastestLapRider+"</li>\n";
        if (raceClasses[this.children[0].id].AverageSpeed !== null && raceClasses[this.children[0].id].AverageSpeed > 0) {
            raceInfoHTML += "<li><b>Fastest Lap Speed:</b> "+raceClasses[this.children[0].id].AverageSpeed.toString()+" mph</li>\n";
        }
        if (raceClasses[this.children[0].id].Notes !== null && raceClasses[this.children[0].id].Notes.length > 0) {
            raceInfoHTML += "<li><b>Description:</b> "+  nl2br(raceClasses[this.children[0].id].Notes) +"</li>\n";
        }
        raceInfoHTML += "</ul>\n";
        return raceInfoHTML;
    },
    trigger: 'hover'
});


function drawRiderDetailGraphs(d, i, curObj) {
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

function removeRiderDetailGraphs(d, i, curObj) {
    d3.selectAll(".rider-detail-graphs").remove();
}

function drawRiderDetailPanel(d, i, curObj) {

    // try to find information in riderDataset on this particular rider based on the RiderID value
	var curRiderID = d[0].RiderID;

    curDisplayedRiderID = curRiderID;

	var riderInfo = riderDataset.filter(function(d) { return d.RiderID === curRiderID; });

    // if we found the rider info in the riderDataset, build out the ASIDE detailed info on the rider
	if ( riderInfo !== null && riderInfo.length === 1) {
	    var riderInfoHTML = "<h2><a href=\""+ riderInfo[0].TTDatabaseWebpage +"\" class=\"external\" target=\"_blank\">"+riderInfo[0].RiderName+"</a></h2>\n";

        // clean and show the rider biography
		var bio = riderInfo[0].Biography;
		if (bio !== null && bio.length > 0) {
		    // if we find any occurrences of two successive single quotes, replace them with one single quote
			bio = bio.replace(/""+/ig, '"');
			// update the IOMTT database website relative image path for any inline images to use our local copy of the
			// images; I used "wget" to download and save local copies of them all, per the Project 2 requirement that
			// ALL resources must be fully localized
			bio = bio.replace(/\/images\/cache/ig, 'img/tt-rider-photos/');
			riderInfoHTML += "<p>"+bio+"</p>\n";
        }

        // show any rider pictures we found
		if (
            (riderInfo[0].Picture2 !== null && riderInfo[0].Picture2.length > 0) ||
            (riderInfo[0].Picture3 !== null && riderInfo[0].Picture3.length > 0)
		) {
            riderInfoHTML += "<hr />\n";
			if (riderInfo[0].Picture2 !== null && riderInfo[0].Picture2.length > 0) {
			    // we need to strip out the old, absolute URL to the IOMTT DB rider pictures, and substitute our own local copy of the pictures
			    var picture2URL = riderInfo[0].Picture2.replace("http://www.iomtt.com/images/cache/", "img/tt-rider-photos/");
                riderInfoHTML += "<img class=\"riderPics\" src=\""+picture2URL+"\" title=\""+riderInfo[0].RiderName+"\ picture 2\" />\n";
            }
            if (riderInfo[0].Picture3 !== null && riderInfo[0].Picture3.length > 0) {
                // we need to strip out the old, absolute URL to the IOMTT DB rider pictures, and substitute our own local copy of the pictures
                var picture3URL = riderInfo[0].Picture3.replace("http://www.iomtt.com/images/cache/", "img/tt-rider-photos/");
                riderInfoHTML += "<img class=\"riderPics\" src=\""+picture3URL+"\" title=\""+riderInfo[0].RiderName+"\ picture 2\" />\n";
            }
        }

        // determine if we have non-zero values for career TT race placement in positions 1-10, or DNF occurrences
		var occ1   = (isNaN(riderInfo[0].TTCareerSummaryPosition1))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition1);
		var occ2   = (isNaN(riderInfo[0].TTCareerSummaryPosition2))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition2);
		var occ3   = (isNaN(riderInfo[0].TTCareerSummaryPosition3))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition3);
		var occ4   = (isNaN(riderInfo[0].TTCareerSummaryPosition4))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition4);
		var occ5   = (isNaN(riderInfo[0].TTCareerSummaryPosition5))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition5);
		var occ6   = (isNaN(riderInfo[0].TTCareerSummaryPosition6))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition6);
		var occ7   = (isNaN(riderInfo[0].TTCareerSummaryPosition7))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition7);
		var occ8   = (isNaN(riderInfo[0].TTCareerSummaryPosition8))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition8);
		var occ9   = (isNaN(riderInfo[0].TTCareerSummaryPosition9))   ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition9);
		var occ10  = (isNaN(riderInfo[0].TTCareerSummaryPosition10))  ? 0 : parseInt(riderInfo[0].TTCareerSummaryPosition10);
		var occDNF = (isNaN(riderInfo[0].TTCareerSummaryPositionDNF)) ? 0 : parseInt(riderInfo[0].TTCareerSummaryPositionDNF);
		if ( occ1>0 || occ2>0 || occ3>0 || occ4> 0 || occ5>0 || occ6>0 || occ7>0 || occ8>0 || occ9>0 || occ10>0 || occDNF>0 ) {
		    riderInfoHTML += "<hr />\n";
			riderInfoHTML += "<p>This table shows how many times has come in each of the top ten places in any TT race, and how many times they did not finish (DNF) a race they began.</p>\n";
			riderInfoHTML += "<table class=\"ttCareerSummary\" summary=\"TT Career Summary\"><caption><strong>TT Career Summary</strong></caption><tr><th id=\"position\">Position</th><td headers=\"position\">1</td><td headers=\"position\">2</td><td headers=\"position\">3</td><td headers=\"position\">4</td><td headers=\"position\">5</td><td headers=\"position\">6</td><td headers=\"position\">7</td><td headers=\"position\">8</td><td headers=\"position\">9</td><td headers=\"position\">10</td><td headers=\"position\"><abbr title=\"Did not finish\">DNF</abbr></td></tr><tr><th id=\"numTimes\"># of times</th><td headers=\"numTimes\">"+occ1+"</td><td headers=\"numTimes\">"+occ2+"</td><td headers=\"numTimes\">"+occ3+"</td><td headers=\"numTimes\">"+occ4+"</td><td headers=\"numTimes\">"+occ5+"</td><td headers=\"numTimes\">"+occ6+"</td><td headers=\"numTimes\">"+occ7+"</td><td headers=\"numTimes\">"+occ8+"</td><td headers=\"numTimes\">"+occ9+"</td><td headers=\"numTimes\">"+occ10+"</td><td headers=\"numTimes\">"+occDNF+"</td></tr></table>";
		}

        // update the rider info div with the detailed HTML
		$("#riderInfo").html(riderInfoHTML);
    }
}

function removeRiderDetailPanel(d, i, curObj) {
    curDisplayedRiderID = undefined;
    $("#riderInfo").html("");
}

function drawRiderTooltip(d, i, curObj) {

    removeRiderTooltip(d,i);

    var con = d3.select("#viz");

    // Since our information box is going to be appended into the
    // overall visualization container, we need to find out its position
    // on the screen so that the absolutely positioned infobox shows up
    // in the right place. It's easy to do this with jQuery
    var pos = $(con[0][0]).position();

    // d3.mouse returns the mouse coordinates relative to the specified
    // container. Since we'll be appending the small infobox to the
    // overall visualization container, we want the mouse coordinates
    // relative to that.
    var mouse = d3.mouse(con[0][0]);
    var info = con.selectAll("div.race-line-tooltip").data([mouse]);

    // change the offset a little bit
    var cushion = [10, 10];
    // record the offset as part of the 'this' context, which in this
    // case stands for the circle that initiated the mouseover event
    this._xoff = cushion[0] + mouse[0] + pos.left;
    this._yoff = cushion[1] + mouse[1] + pos.top;

    // build out the text to show on the TOOLTIP
    var riderInfoText = "<ul>\n";
    riderInfoText += "<li><b>Rider:</b> "+d[0].Rider1+"</li>\n";
    if (d[0].Rider2 !== null && d[0].Rider2.length > 0) {
        riderInfoText += "<li><b>Second Rider:</b> "+d[0].Rider2+"</li>\n";
    }
    riderInfoText += "<li><b>Race Class:</b> "+d[0].RaceClass.Class+"</li>\n";
    riderInfoText += "</ul>\n";

    // show the TOOLTIP in the main visualization area
    info.enter()
        .append("div")
        .attr("class","race-line-tooltip")
        .attr("style", "top: " + this._yoff + "px; left: " + this._xoff + "px;")
        .html(riderInfoText);
}

function removeRiderTooltip(d, i, curObj) {
    // quickly remove the rider info tooltip; don't want to do a transition because the user will most likely
    // be mousing over/out of several lines at once since the primary visualization has a ton of race lines
    d3.selectAll(".race-line-tooltip").remove();
}


// if a user clicks to remove any currently selected rider, clear
// the rider detail panel, sub-visualizations, and any selected race lines
function clearAllSelectedRiders() {
    $("#riderSelectionFilter").html("");
    removeRiderDetailPanel();
    removeRiderDetailGraphs();
    removeRiderTooltip();
    d3.selectAll(".race-line-selected")
      .attr("class", function(d) {
          return ("race-line "+getRaceClassLineStyle(d[0].RaceType));
      });
    curClickedRiderID = undefined;
    curDisplayedRiderID = undefined;
}

// when the user clicks on a race line, preserve the current rider detail panel and detail graphs, until they either:
//     - clear the currently selected rider, or
//     - click on a different rider's race line (thereby selecting a new rider)
function riderRaceLineClick(d, i) {

    // if the rider race line that was clicked is the same as the one currently selected, de-select the race line
    // and remove the detailed rider info
    if ( curClickedRiderID == d[0].RiderID ) {
        clearAllSelectedRiders();
    }
    // regular race line clicked for first time - show detailed rider info
    else {
        // update the global marker variable to denote which rider was clicked
        curClickedRiderID = d[0].RiderID;

        // update the "Selected Rider" filter section to show just the name of the currently selected rider
        var riderName = d[0].Rider1;
        $("#riderSelectionFilter").html("");
        $("#riderSelectionFilter").append("<h3>Selected Rider</h3>");
        $("#riderSelectionFilter").append("<ul id=\"riderSelection\">");
        var curRiderElement = "<li><span class=\"raceFilter\" id=\"formulaoneee\"><div class=\"riderFilterBox darkred\">&#10006;</div> "+riderName+"</span></li>";
        $("#riderSelection").append(function(){
            return $(curRiderElement).click(clearAllSelectedRiders);
        });

        // let the mouseover function determine how to update the display
        raceLineMouseOver(d, i, this);
    }

    return 0;
}

// show a tooltip with rider information and highlight the racing line when mousing over one
function raceLineMouseOver (d, i, curObj) {
    // sometimes this function is called when just mousing over a race line, but it is also called when a rider
    // clicks on a race line; when being called from "racelineclick", the current object is passed to the function
    // rather than being the implicit "this" that you get when this function is just called from "mouseover".
    // This is an important difference because it changes how we use D3 to select the currently clicked or
    // moused-over race line to change the styles of the race line
    try {
        // this will remove the styling of any previously-existing already clicked rider race lines
        d3.selectAll(".race-line-selected")
          .attr("class", function(curD) {
                var classToRestore = getRaceClassLineStyle(d[0].RaceType);
                if (curD[0].RiderID != curClickedRiderID) {
                    return ("race-line "+classToRestore);
                } else {
                    return (getRaceClassLineStyle(curD[0].RaceType)+" race-line-selected");
                }
            });

        // and this will select the new current race line
        d3.select(this).attr("class", getRaceClassLineStyle(d[0].RaceType)+" race-line-selected");
        d3.select(curObj).attr("class", getRaceClassLineStyle(d[0].RaceType)+" race-line-selected");
    }
    // disregard any errors that are caught - they're just a side-effect of calling d3.select() on the wrong object
    // based on whether this function was called by "mouseover" on the race line, or from "racelineclick"
    catch (err) { }

    drawRiderTooltip(d, i, curObj);

    if (
        (typeof curClickedRiderID == "undefined") ||
        (
            typeof curClickedRiderID != "undefined" &&
            typeof curDisplayedRiderID != "undefined" &&
            curClickedRiderID !== curDisplayedRiderID
        )
    ) {
        removeRiderDetailPanel(d, i, curObj);
        removeRiderDetailGraphs(d, i, curObj);
        drawRiderDetailPanel(d, i, curObj);
        drawRiderDetailGraphs(d, i, curObj);
    }
    return 0;
}

// remove the tooltip and drop the race line highlighting on mouseout
function raceLineMouseOut (d, i, curObj) {
    // only remove all the styles and everything if the currentRiderID is different from the one passed in d
	if (typeof curClickedRiderID == "undefined" || curClickedRiderID !== d[0].RiderID) {
        var classToRestore = getRaceClassLineStyle(d[0].RaceType);

        // and remove the highlighting of the race line, and return the original class coloring
        d3.select(this).attr("class","race-line "+classToRestore);

        removeRiderTooltip(d, i, curObj);

        if (curDisplayedRiderID !== curClickedRiderID) {
            removeRiderDetailPanel(d, i, curObj);
            removeRiderDetailGraphs(d, i, curObj);
        }
    }
}

function circleMouseOver(d, i) {
    drawCircleTooltip(d, i);
}

function circleMouseOut (d, i) {
    removeCircleTooltip(d, i);
}

// remover tooltip if the user mouses out.
function removeCircleTooltip(d, i) {
    d3.selectAll(".circle-tooltip").remove();
}

function drawCircleTooltip(d, i) {

    var con = d3.select("#viz");

    // Since our information box is going to be appended into the
    // overall visualization container, we need to find out its position
    // on the screen so that the absolutely positioned infobox shows up
    // in the right place. It's easy to do this with jQuery
    var pos = $(con[0][0]).position();

    // d3.mouse returns the mouse coordinates relative to the specified
    // container. Since we'll be appending the small infobox to the
    // overall visualization container, we want the mouse coordinates
    // relative to that.
    var mouse = d3.mouse(con[0][0]);
    var info = con.selectAll("div.circle-tooltip").data([mouse]);

    // change the offset a little bit
    var cushion = [10, 10];
    // record the offset as part of the 'this' context, which in this
    // case stands for the circle that initiated the mouseover event
    this._xoff = cushion[0] + mouse[0] + pos.left;
    this._yoff = cushion[1] + mouse[1] + pos.top;

    // build out the text to show on the TOOLTIP
    var riderInfoText = "<ul>\n";
    riderInfoText += "<li><b>Position:</b> "+d.Position+"</li>\n";
    riderInfoText += "<li><b>Speed:</b> "+d.Speed+"</li>\n";
    riderInfoText += "</ul>\n";

    // show the TOOLTIP in the lower visualization area
    info.enter()
        .append("div")
        .attr("class","circle-tooltip")
        .attr("style", "top: " + this._yoff + "px; left: " + this._xoff + "px;")
        .html(riderInfoText);
}

function getRaceClass(raceName) {
    for (var raceKey in raceClasses) {
        var regex = new RegExp(raceKey, "ig");
        raceName = raceName.replace(/\s+/g, '');  // remove spaces from the race name so we can perform regex matches against the raceClasses which have no spaces

        if (raceName.match(regex)) {
            return raceClasses[raceKey];
            //} else if (raceName.toLowerCase() == "tt 2002 iom steam pckt  250cc results") {
        } else if (raceName.toLowerCase() == "tt2002iomsteampckt250ccresults") {
            return raceClasses["lightweight"];
        }
    }
    return null;  // race class not found
}

function getRaceClassLineStyle(raceClass) {
    switch (raceClass) {
        case "formulaone" :
            return "formulaone";
        case "junior" :
            return "junior";
        case "lightweight" :
            return "lightweight";
        case "production" :
            return "production";
        case "senior" :
            return "senior";
        case "sidecara" :
            return "sidecara";
        case "sidecarb" :
            return "sidecarb";
        case "singles" :
            return "singles";
        case "superbike" :
            return "superbike";
        case "supersporta" :
            return "supersporta";
        case "supersportb" :
            return "supersportb";
        case "superstock" :
            return "superstock";
        case "ultralightweight" :
            return "ultralightweight";
        case "zero" :
            return "zero";
    }
}
