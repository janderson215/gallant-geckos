var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/', function(req, res) {
  res.status(200).send('Hello World');
});


app.listen(3000, function() {
  console.log('listening on port 3000!');
});

module.exports = app;