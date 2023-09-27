// set the dimensions and margins of the graph
var margin = {top: 30, right: 500, bottom: 60, left: 500},
    width = 1800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("../csv/sentiment.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.candidate)}).keys()

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) 
      .attr("value", function (d) { return d; }) 

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "14px")
      .call(d3.axisBottom(x).ticks(7));
    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
      .style("text-anchor", "middle")
      .text("Time Window");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([-1, 1])
      .range([ height, 0 ]);
    svg.append("g")
      .style("font-size", "14px")
      .call(d3.axisLeft(y));
    svg.append("text")
      .attr("x", -(height/5))
      .attr("y", 15)
      .style("text-anchor", "middle")
      .text("Sentiment");

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.candidate==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.index) })
          .y(function(d) { return y(d.sentiment) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection
      var dataFilter = data.filter(function(d){return d.candidate==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.index) })
            .y(function(d) { return y(d.sentiment) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})
