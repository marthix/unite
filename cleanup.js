var knex = require('knex')({
  client: 'pg',
  connection: (process.env.DATABASE_URL || 'postgres://localhost/jason'),
  searchPath: 'knex,public'
})
var moment = require('moment')
var old = moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss.SS')

console.log('Starting DB Cleanup')

knex('teams').where('created_at', '<', old).del()
  .then(function(){
    console.log('DB Cleanup of Old Teams Complete')

    knex('teams')
      .whereIn('id', function() {
        this.select('teams.id').from('teams').leftJoin('user_team', 'teams.id', 'user_team.team_id').whereNull('user_team.team_id')
      })
      .del()
      .then(function(){
        console.log('DB Cleanup of Userless Teams Complete')
        process.exit()
      })
  })
