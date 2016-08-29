var teamId = window.location.search.replace('?id=', '')
var playerIds = []
var creatorId
var playerRow

fetch('/api/v1/teams?id=' + teamId, {
  credentials: 'include'
})
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json){
    console.log(json)

    creatorId = json.creator_id

    var teamLobbyBox = document.createElement('div')
    teamLobbyBox.classList.add('column', 'column-75')

    var welcome = document.createElement('h3')
    welcome.innerHTML = 'Welcome to your team lobby.'

    var game = document.createElement('h5')
    game.classList.add('team-label')
    game.innerHTML = 'Game: '

    var gameInfo = document.createElement('span')
    gameInfo.classList.add('team-info')
    gameInfo.setAttribute('id', 'game-info')
    gameInfo.innerHTML = json.game.title

    var mode = document.createElement('h5')
    mode.classList.add('team-label')
    mode.innerHTML = 'Mode: '

    var modeInfo = document.createElement('span')
    modeInfo.classList.add('team-info')
    modeInfo.setAttribute('id', 'mode-info')
    modeInfo.innerHTML = json.mode.name

    var seriousness = document.createElement('h5')
    seriousness.classList.add('team-label')
    seriousness.innerHTML = 'Seriousness: '

    var seriousnessInfo = document.createElement('span')
    seriousnessInfo.classList.add('team-info')
    seriousnessInfo.setAttribute('id', 'seriousness-info')
    seriousnessInfo.innerHTML = json.seriousness

    var players = document.createElement('h6')
    players.classList.add('team-label')
    players.innerHTML = 'Players:'

    playerRow = document.createElement('div')
    playerRow.classList.add('row')

    json.users.forEach(function(user){
      addPlayer(user)
    })

    game.appendChild(gameInfo)
    mode.appendChild(modeInfo)
    seriousness.appendChild(seriousnessInfo)

    teamLobbyBox.appendChild(welcome)
    teamLobbyBox.appendChild(game)
    teamLobbyBox.appendChild(mode)
    teamLobbyBox.appendChild(seriousness)
    teamLobbyBox.appendChild(players)
    teamLobbyBox.appendChild(playerRow)

    var chatBox = document.createElement('div')
    chatBox.classList.add('column', 'column-25')
    chatBox.innerHTML = '<iframe src="http://discordi.deliriousdrunkards.com/render?id=' + json.discord_server +'&title=Unite Team&theme=dark&join=true&abc=true&showall=true&toggle=true&shownick=false" width="300px" height="400px" frameborder="0"></iframe>'
    // chatBox.innerHTML = '<iframe src="https://discordapp.com/widget?id=' + json.discord_server + '&theme=dark" width="100%" height="500" allowtransparency="true" frameborder="0"></iframe>'
//     chatBox.innerHTML = `<script type="text/javascript" src="//cdn.jsdelivr.net/discord-widget/1.0/discord-widget.min.js"></script>
// <script type="text/javascript">
//     discordWidget.init({
//         serverId: ` + json.discord_server +`,
//         title: 'Discord Widget Title',
//         join: false,
//         alphabetical: false,
//         theme: 'dark',
//         hideChannels: ['Channel Name 1', 'Channel Name 2'],
//         showAllUsers: true,
//         allUsersDefaultState: true
//     });
//     discordWidget.render();
// </script>
// <div class="discord-widget"></div>`

    document.getElementById('team-lobby').appendChild(teamLobbyBox)
    document.getElementById('team-lobby').appendChild(chatBox)
  })

Pusher.logToConsole = true;

var pusher = new Pusher('3aa26893ee89f046e2a3', {
  encrypted: true
})

var channel = pusher.subscribe('team_' + teamId)
channel.bind('player_joined', function(data) {
  addPlayer(data)
})

function addPlayer(player) {
  if (!playerIds.includes(player.id)){
    playerIds.push(player.id)
    var playerBox = document.createElement('div')
    playerBox.classList.add('column', 'column-10')

    var avatar = document.createElement('img')
    if (player.avatar === null) {
      avatar.setAttribute('src', 'https://robohash.org/' + player.username)
    } else {
      avatar.setAttribute('src', 'https://discordapp.com/api/users/' + player.discord_id + '/avatars/' + player.avatar + '.jpg')
    }
    avatar.classList.add('party')

    playerBox.appendChild(avatar)

    if (player.id === creatorId) {
      var leader = document.createElement('img')
      leader.setAttribute('src', './assets/images/leader.svg')
      leader.classList.add('leader-icon')

      playerBox.appendChild(leader)
    }

    playerRow.appendChild(playerBox)

    return playerBox
  }
}
