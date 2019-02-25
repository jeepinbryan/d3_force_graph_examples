// Original demo from Mike Bostock: https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048

const margin = {top: 40, bottom: 10, left: 20, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Creates sources <svg> element and inner g (for margins)
const svg = d3.select('body').append('svg')
.attr('width', width+margin.left+margin.right)
.attr('height', height+margin.top+margin.bottom)
.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);

/////////////////////////

const simulation = d3.forceSimulation()
.force('link', d3.forceLink().id((d) => d.id))
.force('charge', d3.forceManyBody())
.force('center', d3.forceCenter(width / 2, height / 2));

const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json('miserables.json').then((data) => {

  // Links data join
  const link = svg.selectAll('.link').data(data.links);

  const link_enter = link.enter().append('line')
  .attr('class', 'link');
  const link_update = link.merge(link_enter);

  link.exit().remove();


  // Nodes data join
  const node = svg.selectAll('.node').data(data.nodes);

  const node_enter = node.enter().append('circle')
  .attr('class', 'node')
  .attr('r', 10);
  node_enter.append('title').text((d) => d.id);

  const node_update = node.merge(node_enter);
  node_update.style('fill', (d) => color(d.group));

  node.exit().remove();

  simulation
    .nodes(data.nodes)
    .force('link').links(data.links);

  simulation.on('tick', (e) => {
    link_update
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node_update
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  });
});
