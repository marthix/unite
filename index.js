var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'egs')

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
