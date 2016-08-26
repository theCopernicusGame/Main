// DIRECTIONS, entry
// / *... are internal notes

// requirements:
// express.io integrates socket.io with express
// body/cookieParser for client keys as unique links/rooms
var express = require('express.io');
var app = express();
app.http().io();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');

app.use(express.static(path.join(__dirname + '/../')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// currently test page url, to be home page url
// get req.params for specific room url
app.get('/', function(req, res){
    res.sendfile('views/index.html');
});

app.get('/galaxy', function(req, res){
    res.sendfile('views/galaxy.html');
});

app.listen(process.env.PORT || 3001, function(){
    console.log('You listenin on port 3001');
});

// DIRECTIONS, to dataChannel.js

// DIRECTIONS, on emission of 'ready' event in datachannel.js
// connects client to unique room
app.io.route('ready', function(req) {
    req.io.join(req.data.signal_room);
})

// DIRECTIONS, to dataChannel.js

// on emission of the 'signal' event in datachannel.js
// this route broadcasts to every client in the room but the sender the signaling_message
// this runs the io.on('signaling_message', ...) event in datachannel.js (ln 33)
app.io.route('signal', function(req) {
    req.io.room(req.data.room).broadcast('signaling_message', {
    type: req.data.type,
    message: req.data.message
  });
})
