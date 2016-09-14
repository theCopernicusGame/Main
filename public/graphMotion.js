'use strict';

var count = 1;
var v0;
var t;
var GRAPH = document.getElementById('line-graph');
var maxHeight = 0;
var width = window.innerWidth
var height = window.innerHeight;
var lineWidth;

function onWindowResize() {
   width = window.innerWidth
   height = window.innerHeight;
}

if (isDemo === true) lineWidth = 6;
else lineWidth = 3;

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
  margin: { t: 20, b: 40, r: 20, l: 50 }
}

var savedPos = {};
savedPos.x = [];
savedPos.y = [];

function storePosition() {
  savedPos.x.push(5 - ball.position.x);
  savedPos.y.push(ball.position.y - .3);
  if (ball.position.y - .3 > maxHeight) maxHeight = (Math.ceil((ball.position.y - .3) * 2) / 2).toFixed(1);
}

function graphMotion() {
  t = parseFloat((performance.now() - t)/1000).toFixed(3);
  if (count > 1) Plotly.deleteTraces(GRAPH, GRAPH.data.length - 1);
  Plotly.plot( GRAPH, [
    {
      x: savedPos.x,
      y: savedPos.y,
      name: 'Throw ' + count,
      mode: 'lines',
      line: {
        width: lineWidth
      }
    },
    {
      x: [13, 13],
      y: [0, maxHeight],
      name: 'Target',
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 6
      }
    }
  ],
  layout,
  {displayModeBar: false} );
  $('#line-graph').animate({ opacity: 1 });
  $('#v0Div').text("Initial Velocity: " + v0 + "m/s");
  $('#tDiv').text("Time: " + t + "s");
  count++;
  savedPos.x = [];
  savedPos.y = [];
}
