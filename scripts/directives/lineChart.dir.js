(function(){
	
	"use strict";

	app.directive('linearChart',function(d3Service){
        return {
            restrict:'EA',
  			scope: {
		    	data: '=data'
		    },
		    template:"<div class='lineChart'></div>",
            link: function(scope) {
            	
            	// -> we wait for the d3 library to be loaded and then draw the graph 
            	d3Service.d3().then(function(d3) {
                    // -> Global width and height 
                    var width = 550,
                        height = 250;

		    		// -> defining chart dimensions
                    var vis = d3.select(".lineChart")
                    	.append("svg")
                    	.attr("width", width)
                    	.attr("height", height);

                    // -> Define the div for the tooltip
                    var div = d3.select("body").append("div")   
                        .attr("class", "tooltip")               
                        .style("opacity", 0);


                    // -> defining inner dimensions
                    var WIDTH = width,
                        HEIGHT = height,
                        MARGINS = {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 50
                        },
                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, 6]),// -> X axis range
                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 70]),// -> Y axis range
                        xAxis = d3.svg.axis()
                        .scale(xScale),
                        yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");
                    
              		// -> concating the X axis data range
                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);

                   // -> concating the Y axis data range  
                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);

                    // -> getting data endpoints
                    var lineGen = d3.svg.line()
                        .x(function(d,i) {
                            return xScale(i);
                        })
                        .y(function(d) {
                            return yScale(d.temp);
                        })
                        .interpolate("basis");

                    // -> we are only getting the low and high of each day into separate arrays.
                    var highOfTheDay = [];
                    var lowOfTheDay  = [];

                    for(var i =0; i<scope.data.length; i++){
                        highOfTheDay.push({
                            temp: scope.data[i].high
                        });

                        lowOfTheDay.push({
                            temp: scope.data[i].low
                        });
                    }

                     // -> drawing the lines
                    vis.append('svg:path')
                        .attr('d', lineGen(highOfTheDay))
                        .attr('stroke', 'red')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');


                    vis.append('svg:path')
                        .attr('d', lineGen(lowOfTheDay))
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');

                    // -> this will alow to reuse the tooltip style
                    var tooltipSettings = function(d){
                        div.transition()        
                            .duration(200)      
                            .style("opacity", .9);      
                        div .html(d.day+ "<br/>"+ "high: "+ d.high + "<br/>"+ "low: "+ d.low + "<br/>"  + d.text)  
                            .style("left", (d3.event.pageX) + "px")     
                            .style("top", (d3.event.pageY - 28) + "px");
                    };

                    // -> created dots to show the days on hover
                    vis.selectAll("dot")
                        .data(scope.data)
                        .enter().append("circle")
                        .attr("r", 3.5)
                        .attr("cx", function(d,i) { return xScale(i); })
                        .attr("cy", function(d) { return yScale(d.high); })
                        .on("mouseover", function(d) { tooltipSettings(d); })                  
                        .on("mouseout", function(d) {       
                            div.transition()        
                                .duration(500)      
                                .style("opacity", 0);   
                        });

                    vis.selectAll("dot")
                        .data(scope.data)
                        .enter().append("circle")
                        .attr("r", 3.5)
                        .attr("cx", function(d,i) { return xScale(i); })
                        .attr("cy", function(d) { return yScale(d.low); })
                        .on("mouseover", function(d) { tooltipSettings(d); })                  
                        .on("mouseout", function(d) {       
                            div.transition()        
                                .duration(500)      
                                .style("opacity", 0);   
                        });

		        });
            }
        }
    });
})();