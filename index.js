var express = require('express')
var app = express()

var knex = require('knex')({
  client: 'pg',
  connection: (process.env.DATABASE_URL || 'postgres://localhost/jason'),
  searchPath: 'knex,public'
})

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('template');
})

// ROUTES
app.get('/api/v1/users', function(req, res){
  knex
    .select()
    .from('users')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/teams', function(req, res){
  knex
    .select()
    .from('teams')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/games', function(req, res){
  knex
    .select()
    .from('games')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/modes', function(req, res){
  knex
    .select()
    .from('modes')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/roles', function(req, res){
  knex
    .select()
    .from('roles')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/friends', function(req, res){
  knex
    .select()
    .from('friends')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/user_team', function(req, res){
  knex
    .select()
    .from('user_team')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/user_game', function(req, res){
  knex
    .select()
    .from('user_game')
    .then(function(data){
      res.json(data)
    })
})

app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'))
})
