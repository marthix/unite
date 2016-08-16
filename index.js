var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'egs')
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.listen(8080, function () {
  console.log('Example app listening on port 80!');
});
