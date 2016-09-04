'use strict';

var count = 1;
var v0;
var t;
var GRAPH = document.getElementById('line-graph');
var width = window.innerWidth
var height = window.innerHeight;

function onWindowResize() {
   width = window.innerWidth
   height = window.innerHeight;
}

// in case window size changes
window.onresize = onWindowResize;

var layout = {
  paper_bgcolor: 'transparent', 
  plot_bgcolor: 'transparent', 
  yaxis: {title: "Vertical Displacement (m)"},
  xaxis: {title: "Horizontal Displacement (m)"},
  autosize: false,
  width: width * .3,
  height: height * .5,
  font: {
    family: "Fjalla One, sans-serif",
    size: 10,
    color: "white"
  },
  margin: { t: 20, b: 40, r: 20, l: 50 },
}

var savedPos = {};
savedPos.x = [];
savedPos.y = [];

function storePosition() {
  savedPos.x.push(5 - ball.position.x);
  savedPos.y.push(ball.position.y - .3);
}

function graphMotion() {
  t = parseFloat((performance.now() - t)/1000).toFixed(3);
  Plotly.plot( GRAPH, [{
  x: savedPos.x,
  y: savedPos.y,
  name: 'Throw ' + count }],
  layout,
  {displayModeBar: false} );
  $('#line-graph').animate({ opacity: 1 });
  $('#v0Div').text("Initial Velocity: " + v0 + "m/s");
  $('#tDiv').text("Time: " + t + "s");
  count++;
  savedPos.x = [];
  savedPos.y = [];
}
