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
    res.render('index.html');
});

app.listen(process.env.PORT || PORT, function(){
    console.log('You listenin on port 3001');
});

app.io.route('ready', function(req) {
	req.io.join(req.data.signal_room);
})

app.io.route('signal', function(req) {
	req.io.room(req.data.room).broadcast('signaling_message', {
    type: req.data.type,
    message: req.data.message
  });
})

// DAVID, YOU NEED TO UNDERSTAND THE TWO ABOVE ROUTES BETTER
