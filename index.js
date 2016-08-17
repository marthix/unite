var express = require('express')
var app = express()

var knex = require('knex')({
  client: 'pg',
  connection: (process.env.PG_CONNECTION_STRING || 'postgres://localhost/jason'),
  searchPath: 'knex,public'
})

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/install', function(request, response){
  // Create the users table
  knex.schema.createTable('users', function (table) {
    table.increments('id')
    table.string('username')
    table.string('email')
    table.string('password')
    table.string('avatar')
    table.string('bio')
    table.integer('karma')
  })
    .then(function(){
      console.log('Created users table')
    })

  // Create the teams table
  knex.schema.createTable('teams', function (table) {
    table.increments('id')
    table.integer('game_id')
    table.integer('seriousness')
    table.string('description')
    table.boolean('access')
    table.uuid('invite')
    table.integer('size')
    table.integer('mode_id')
  })
    .then(function(){
      console.log('Created teams table')
    })

  // Create the games table
  knex.schema.createTable('games', function (table) {
    table.increments('id')
    table.string('title')
    table.string('title')
  })
    .then(function(){
      console.log('Created games table')
    })

  // Create the roles table
  knex.schema.createTable('roles', function (table) {
    table.increments('id')
    table.string('name')
    table.string('icon')
    table.integer('game_id')
  })
    .then(function(){
      console.log('Created roles table')
    })

  // Create the modes table
  knex.schema.createTable('modes', function (table) {
    table.increments('id')
    table.string('name')
    table.integer('game_id')
  })
    .then(function(){
      console.log('Created modes table')
    })

  // Create the friends table
  knex.schema.createTable('friends', function (table) {
    table.increments('id')
    table.integer('user_id')
    table.integer('friend_id')
  })
    .then(function(){
      console.log('Created friends table')
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
