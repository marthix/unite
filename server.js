var request = require('request')
var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var ejs = require('ejs')
var app = express()
var knex = require('knex')({
  client: 'pg',
  connection: (process.env.DATABASE_URL || 'postgres://localhost/jason'),
  searchPath: 'knex,public'
})
var bookshelf = require('bookshelf')(knex)
var models = require('./models')
var User = models.User,
    Team = models.Team,
    Game = models.Game,
    Mode = models.Mode
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth2').Strategy
var shortid = require('shortid32')
var Pusher = require('pusher')
var Discord = require('discord.io')
var flash = require('connect-flash')
var sanitizeHTML = require('sanitize-html')
var config = require('./config')


// Pusher info
var pusher = new Pusher(config.pusher)

// Discord bot info
var discord = new Discord.Client(config.discord)

bookshelf.plugin('registry')

// Middleware
app.use(session({ secret: 'keyboard cat' }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Discord authentication
passport.serializeUser(function(user, done){
  done(null, user.id)
})

passport.deserializeUser(function(id, done){
  User.findById(id)
    .then(function(user){
      done(null, user)
    })
})

passport.use(new OAuth2Strategy(config.passport,
  function(accessToken, refreshToken, profile, cb) {
    request({
      url: 'https://discordapp.com/api/users/@me',
      auth: {
        bearer: accessToken
      }}, function(err, res) {
        var profile = JSON.parse(res.body)

        User.findOrCreate({
          discord_id: profile.id,
          username: profile.username,
          username_full: profile.username + '#' + profile.discriminator,
          email: profile.email,
          avatar: profile.avatar
        })
          .then(function(user) {
            user.set({token: accessToken}).save()
            return cb(null, user)
          })
      })
  }
))

app.set('port', (process.env.PORT || 5000))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// ENDPOINTS
// Home
app.get('/', function (req, res) {
  var user = (req.user || {attributes: {}})
  var loggedIn = req.isAuthenticated()
  var flash = req.flash('url')

  if(!flash[0]) {
    res.render('index', {user: user.attributes, loggedIn: loggedIn})
  } else {
    res.redirect(flash[0])
  }
})

// Join a Game
app.get('/directory', function (req, res) {
  var user = (req.user || {attributes: {}})
  var loggedIn = req.isAuthenticated()

  if(!loggedIn) {
    res.redirect('/')
  } else {
    res.render(!req.query.id ? 'directory' : 'detail', {user: user.attributes, loggedIn: loggedIn, query: req.query.id})
  }
})

// Join a Team
app.get('/team', function (req, res) {
  var user = (req.user || {attributes: {}})
  var loggedIn = req.isAuthenticated()

  if(!loggedIn) {
    res.redirect('/')
  } else {
    knex('teams').where({
      id: req.query.id
    }).select('discord_server')
    .then(function(response){
      if (!response[0]) {
        res.redirect('/')
      } else {
        res.render('team', {user: user.attributes, loggedIn: loggedIn})
      }
    })
  }
})

// Invite
app.get('/i/:invite', function (req, res) {
  var loggedIn = req.isAuthenticated()

  if(!loggedIn) {
    req.flash('url', req.originalUrl)
    res.redirect('/login')
  } else {
    knex('teams')
      .where('invite', req.params.invite)
      .then(function(teams) {
        res.redirect('/team?id=' + teams[0].id)
      })
  }
})

// Login/Logout
app.get('/login',
  passport.authenticate('oauth2', { scope: ['identify', 'email'] }))

app.get('/login/auth',
  passport.authenticate('oauth2', { successRedirect: '/', failureRedirect: '/login' }))

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

// API ROUTES - GET
app.get('/api/v1/users', function(req, res){
  knex
    .select()
    .from('users')
    .then(function(data){
      res.json(data)
    })
})

app.get('/api/v1/teams', function(req, res){
  var team = new Team
  var user = req.user

  if (!req.query.id) {
    Team.fetchAll()
      .then(function(data){
        res.send(data.toJSON())
      })
  } else {
    Team.where('id', req.query.id).fetch({withRelated: ['game', 'users', 'mode']})
    .then(function(team){
      knex('user_team')
        .where('user_id', user.id)
        .select('team_id')
        .then(function(userTeams){
          userTeams.forEach(function(userTeam){
            pusher.trigger('team_' + userTeam.team_id, 'player_left', user)
          })
          // remove user from all other teams
          knex('user_team')
          .where('user_id', user.id)
          .del()
          // then add the user to the current team
          .then(function(){
            knex('user_team')
            .insert({user_id: user.id, team_id: team.id})
            // then update the team
            .then(function(){
              Team.where('id', req.query.id).fetch({withRelated: ['game', 'users', 'mode']})
              .then(function(team){
                pusher.trigger('team_' + req.query.id, 'player_joined', user)
                res.send(team.toJSON())
              })
            })
          })
        })
    })
  }
})

app.get('/api/v1/games', function(req, res){
  if (!req.query.id) {
    Game.fetchAll({withRelated: ['teams', 'teams.users']})
      .then(function(data){
        res.send(data.toJSON())
      })
  } else {
    Game.where('id', req.query.id).fetch({withRelated: ['teams', 'teams.users', 'teams.mode', 'modes']})
    .then(function(data){
      res.send(data.toJSON())
    })
  }
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

// API ROUTES - POST
app.post('/api/v1/chat', function(req, res) {
  req.body.message = sanitizeHTML(req.body.message, {
    allowedTags: [],
    allowedAttributes: []
  })

  pusher.trigger('team_' + req.body.team_id, 'message', req.body)

  res.json(true)
})

app.post('/api/v1/teams', function(req, res){
  var loggedIn = req.isAuthenticated(),
  invite = shortid.generate(),
  team = new Team,
  user = req.user,
  serverName = user.attributes.username + "'s Unite Team",
  serverId,
  serverInvite,
  description = sanitizeHTML(req.body.description, {
    allowedTags: [],
    allowedAttributes: []
  }),
  serverIcon = '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'

  if (!loggedIn) {
    res.redirect('/')
  }
  else {
    discord.createServer({
      icon: serverIcon,
      name: serverName,
      region: 'us-central'
    }, function(error, response){
      console.log(response)
      serverId = response.id
      discord.createInvite({
        channelID: serverId,
        temporary: true
      }, function(err, response){
        serverInvite = response.code

        team.set({game_id: req.body.game_id, seriousness: req.body.seriousness, description: description, invite: invite, mode_id: req.body.mode_id, creator_id: user.id, discord_invite: serverInvite, discord_server: serverId})

        team.save()
        .then(function(team){
          res.redirect('/team?id=' + team.id)
        })
      })
    })
  }
})

// Discord bot code
discord.on('ready', function(event) {
  console.log('Logged in as %s - %s\n', discord.username, discord.id)
})

discord.on('disconnect', function(errMsg, code) {
  discord.connect()
})


app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port', app.get('port'))
})
