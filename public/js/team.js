var teamId = window.location.search.replace('?id=', '')
var playerIds = []

fetch('/api/v1/teams?id=' + teamId, {
  credentials: 'include'
})
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json){
    console.log(json)

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

    var playerRow = document.createElement('div')
    playerRow.classList.add('row')

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
    chatBox.classList.add('column', 'column-25', 'chat')
    chatBox.innerHTML = 'CHAT PLACEHOLDER'

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

  }
}

  // <div class="column column-75">
  //   <div class="row">
  //     <div class="column column-10">
  //       <img src="./assets/images/avatar.jpg" class="party"/>
  //     </div>
  //     <div class="column column-10">
  //       <img src="./assets/images/avatar.jpg" class="party leader"/>
  //       <img src="./assets/images/leader.svg" class="leader-icon" />
  //     </div>
  //     <div class="column column-10">
  //       <img src="./assets/images/avatar.jpg" class="party"/>
  //     </div>
  //   </div>
  // </div>
  // <div class="column column-25 chat">
  //   CHAT
  // </div>
