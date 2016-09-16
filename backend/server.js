// express.io integrates socket.io with express
// body/cookieParser for client keys as unique links/rooms

var fs = require('fs');
var express = require('express.io');
var app = express();
app.http().io();

var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname + '/../')));

// when requests are made over http, redirect to secure http
app.use(function(req, res, next) {
  if (req.headers['x-forwarded-proto'] === 'http') {
    res.redirect("https://" + req.headers.host + req.url);
  } else next();
});

// home page url
app.get('/', function(req, res) {
  res.sendfile('views/galaxy.html');
});

// choose room url
app.get('/game', function(req, res) {
  res.sendfile('views/search.html');
});

// game room url, * refers to unique room identifier string
app.get('/game/*', function(req, res) {
  res.sendfile('views/index.html');
});

// listen on port 3001 for development
app.listen(process.env.PORT || 3001, function(){
  console.log("You're listening on port", process.env.PORT || 3001 + ".");
});


// on emission of 'ready' event in datachannel.js
// connects client to unique room
app.io.route('ready', function(req) {
  req.io.join(req.data.signal_room);
})

// on emission of the 'signal' event in datachannel.js
// this route broadcasts to every client in the room the signaling_message
app.io.route('signal', function(req) {
  req.io.room(req.data.room).broadcast('signaling_message', {
    type: req.data.type,
    message: req.data.message
  });
})
