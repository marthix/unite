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
var serverIconConfig = require('./servericon')


// Pusher info
var pusher = new Pusher(config.pusher)

// Discord bot info
var discord = new Discord.Client(config.discord)

bookshelf.plugin('registry')

// Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }))
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
  serverIcon = serverIconConfig;

  if (!loggedIn) {
    res.redirect('/')
  }
  else {
    discord.createServer({
      icon: serverIcon,
      name: serverName,
      region: 'us-central'
    }, function(error, response){
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
