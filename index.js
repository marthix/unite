var express = require('express')
var app = express()

var knex = require('knex')({
  client: 'pg',
  connection: 'postgres://localhost/jason',
  searchPath: 'knex,public'
})

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/install', function(request, response){
  knex.schema.createTable('users', function (table) {
    table.increments()
    table.string('name')
    table.timestamps()
  })
    .then(function(){
      console.log('Created users table')
    })

  response.send('Finished')
})

app.get('/', function (request, response) {
  var loggedIn = request.query.loggedin === 'yes'

  response.render('template', {loggedIn: loggedIn})
})

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'))
})
