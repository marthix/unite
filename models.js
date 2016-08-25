var knex = require('knex')({
  client: 'pg',
  connection: (process.env.DATABASE_URL || 'postgres://localhost/jason'),
  searchPath: 'knex,public'
})
var bookshelf = require('bookshelf')(knex)
var ModelBase = require('bookshelf-modelbase')(bookshelf)

// MODELS
// User
var User = ModelBase.extend({
  tableName: 'users',
  hasTimestamps: true,
  teams: function() {
    return this.belongsToMany(Team, 'user_team')
  }
})

// Game
var Game = bookshelf.Model.extend({
  tableName: 'games',
  hasTimestamps: true,
  teams: function() {
    return this.hasMany(Team);
  },
  modes: function() {
    return this.hasMany(Mode)
  }
})

// Team
var Team = bookshelf.Model.extend({
  tableName: 'teams',
  hasTimestamps: true,
  game: function() {
    return this.belongsTo(Game);
  },
  users: function() {
    return this.belongsToMany(User, 'user_team')
  },
  mode: function() {
    return this.belongsTo(Mode)
  },
  addUser: function(user) {
    this.users().attach(user)
  }
})

// Mode
var Mode = bookshelf.Model.extend({
  tableName: 'modes',
  hasTimestamps: true,
  game: function() {
    return this.belongsTo(Game)
  },
  teams: function() {
    return this.belongsToMany(Team)
  }
})

module.exports = {User: User, Game: Game, Team: Team, Mode: Mode}
