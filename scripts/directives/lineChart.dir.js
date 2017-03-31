(function(){
    
    "use strict";

    app.directive('linearChart',function(d3Service){
        return {
            restrict:'EA',
            scope: {
                data: '=data'
            },
            link: function(scope,elem) {
                
                //-> we wait for the d3 library to be loaded and then draw the graph 
                d3Service.d3().then(function(d3) {

                    // -> set the dimensions of the graph
                    var margin = {top: 20, right: 20, bottom: 30, left: 50},
                        padding= -30,
                        width = 650,
                        height = 350;


                    var parseTime = d3.timeParse("%d %b %Y"),//-> parse the date / time
                        x = d3.scaleTime().range([0, width]),
                        y = d3.scaleLinear().range([height, 0]);

                    var dayHigh = d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.high); })
                        .curve(d3.curveBasis),
                    dayLow = d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.low); })
                        .curve(d3.curveBasis);

                    //-> Tooltip
                    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

                    var svg = d3.select(elem[0]).append("svg")
                        .classed("svg-container", true) 
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "0 0 600 400")
                        .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")");

                    scope.data.forEach(function(d) {
                          d.date = parseTime(d.date);
                          d.high = d.high;
                          d.low = d.low;
                    });

                    //-> Scale the range of the data
                    x.domain(d3.extent(scope.data, function(d) { return d.date; }));
                    y.domain([0, 100]);


                    //-> Add the valueline path.
                    svg.append("path")
                        .data([scope.data])
                        .attr("class", "dayHigh")
                        .attr("d", dayHigh);

                        //-> Add the valueline path.
                    svg.append("path")
                        .data([scope.data])
                        .attr("class", "dayLow")
                        .attr("d", dayLow);

                    //-> Add the X Axis
                    svg.append("g")
                        .attr("class", "xAxis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x)
                        .ticks(6)
                        .tickFormat(d3.timeFormat("%a")));
                    //-> Add the Y Axis
                    svg.append("g")
                        .attr("class", "yAxis")
                        .call(d3.axisLeft(y));


                    //-> Recycle var
                    var tooltipSettings = function(d){
                        div.transition()        
                            .duration(200)      
                            .style("opacity", .9);      
                        div .html(d.day+ "<br/>"+ "high: "+ d.high + "<br/>"+ "low: "+ d.low + "<br/>"  + d.text)  
                            .style("left", (d3.event.pageX) + "px")     
                            .style("top", (d3.event.pageY - 28) + "px");
                    };

                    //-> Add the scatterplot
                    svg.selectAll("dot")
                        .data(scope.data)
                        .enter().append("circle")
                        .attr("r", 5)
                        .attr("cx", function(d) { return x(d.date); })
                        .attr("cy", function(d) { return y(d.high); })
                        .on("mouseover", function(d) { tooltipSettings(d); })                  
                            .on("mouseout", function(d) {       
                                div.transition()        
                                .duration(500)      
                                .style("opacity", 0);   
                        });

                    svg.selectAll("dot")
                        .data(scope.data)
                        .enter().append("circle")
                        .attr("r", 5)
                        .attr("cx", function(d) { return x(d.date); })
                        .attr("cy", function(d) { return y(d.low); })
                        .on("mouseover", function(d) { tooltipSettings(d); })                  
                            .on("mouseout", function(d) {       
                                div.transition()        
                                .duration(500)      
                                .style("opacity", 0);   
                        });

                    //-> adds Temperature text to the graph 
                    svg.append("text")
                        .attr("text-anchor", "middle")
                        .attr("transform", "translate("+ padding +","+(height/2)+")rotate(-90)")
                        .text("Temperature");

                });
            }
        }
    });
})();