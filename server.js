var express = require('express.io');
var app = express();
app.http().io();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var PORT = 3001;

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', function(req, res){
    res.send('index.html');
});

app.listen(process.env.PORT || PORT, function(){
    console.log('You listenin on port 3001');
});

// on emission of the 'ready' event in datachannel.js
// this route makes the client join the signal_room
app.io.route('ready', function(req) {
	req.io.join(req.data.signal_room);
})

// on emission of the 'signal' event in datachannel.js
// this route broadcasts to every client in the room but the sender the signaling_message
// this runs the io.on('signaling_message', ...) event in datachannel.js (ln 33)
app.io.route('signal', function(req) {
	req.io.room(req.data.room).broadcast('signaling_message', {
    type: req.data.type,
    message: req.data.message
  });
})
