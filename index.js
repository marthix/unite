var express = require('express')
var ejs = require('ejs')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  var loggedIn = true
  
  ejs.renderFile('index.ejs', {loggedIn: loggedIn}, {}, function(err, html){
    response.send(html)
  })
});

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'));
});
