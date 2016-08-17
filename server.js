var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');

 app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(3001, function(){
    console.log('you listenin on port 3001');
});

module.exports = app;
