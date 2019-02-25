(function() {
  var w = 500,
      h = 500;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .append("g")
    .attr("transform","translate(0,0)")

  var radiusScale = d3.scaleSqrt().domain([1,100]).range([10,80])

 // the simulation is a collection of forces
 // about where we want our circles to go
 // and how we want out circles to interact
 // STEP 1: Get them to the middle
 //         forceX and forceY
 // STEP 2: fix the collision of circles
  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(w/2).strength(0.05))
    .force("y", d3.forceY(h/2).strength(0.05))
    .force("collide", d3.forceCollide(function(d){
      return radiusScale(d.size) + 10
    }))

  d3.queue()
    .defer (d3.csv, "ipaddress.csv")
    .await(ready) //calls function ready

  function ready (error, datapoints) {
    var circles = svg.selectAll(".ipaddress")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "ipaddress")
      .attr("r", function(d) {
        return radiusScale(d.size)
      })
      .attr("fill", "lightblue")
      .on('click', function(d) {
        console.log(d)
      })

    simulation.nodes(datapoints)
      .on('tick',ticked)  //calls function ticked

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }


  }

})();
