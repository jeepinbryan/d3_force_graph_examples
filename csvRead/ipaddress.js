var width = 900,
    height = 500;


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var force = d3.layout.force()
    //.gravity(0.05)
    //.linkDistance(100)
    .charge(-1000)
    .size([width, height]);

d3.csv("ipaddress.csv", function(error, links) {
  if (error) throw error;

  var nodesByName = {};

  // Create nodes for each unique source and target.
  links.forEach(function(link) {
    link.source = nodeByName(link.ipaddress);
    link.target = nodeByName(link.port);
  });

  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);

  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link");

  // Create the node circles.
  var node = svg.selectAll(".node")
      .data(nodes)
      //.enter().append("circle")
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 4.5)
      .call(force.drag)
      .on('click', function(d) {
        console.log(d.name)
      })

  


  // Start the force layout.
  force
      .nodes(nodes)
      .links(links)
      .on("tick", tick)
      .start();

  //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name});
  }
});
