var teamId = window.location.search.replace('?id=', '')
var playerIds = []
var creatorId
var playerRow
var teamLobbyBox = document.createElement('div')
teamLobbyBox.classList.add('column', 'column-75')

document.getElementById('team-lobby').appendChild(teamLobbyBox)

fetch('/api/v1/teams?id=' + teamId, {
  credentials: 'include'
})
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json){
    creatorId = json.creator_id

    var body = document.querySelector('body')
    body.classList.add('game-background-' + json.game_id)

    var back = document.createElement('a')
    back.classList.add('join', 'button', 'button-outline')
    back.setAttribute('href', '/directory?id=' + json.game_id)
    back.innerHTML = '< BACK'

    var welcome = document.createElement('h3')
    welcome.innerHTML = 'Welcome to your team lobby.'

    var invite = document.createElement('h5')
    invite.classList.add('team-label')
    invite.innerHTML = 'Lobby Invite Link: '

    var inviteLink = document.createElement('span')
    inviteLink.classList.add('team-info')
    inviteLink.setAttribute('id', 'invite-link')
    inviteLink.innerHTML = 'unite-gamers.herokuapp.com' + '/i/' + json.invite

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

    var players = document.createElement('h5')
    players.classList.add('team-label')
    players.innerHTML = 'Players:'

    playerRow = document.createElement('div')
    playerRow.classList.add('row')

    var discordButton = document.createElement('a')
    discordButton.classList.add('button', 'button-outline', 'join', 'float-right')
    discordButton.setAttribute('href', 'http://discord.gg/' + json.discord_invite)
    discordButton.setAttribute('target', '_blank')
    discordButton.innerHTML = 'Open Discord Server'

    json.users.forEach(function(user){
      addPlayer(user)
    })

    invite.appendChild(inviteLink)
    game.appendChild(gameInfo)
    mode.appendChild(modeInfo)
    seriousness.appendChild(seriousnessInfo)

    teamLobbyBox.appendChild(discordButton)
    teamLobbyBox.appendChild(back)
    teamLobbyBox.appendChild(welcome)
    teamLobbyBox.appendChild(game)
    teamLobbyBox.appendChild(mode)
    teamLobbyBox.appendChild(seriousness)
    teamLobbyBox.appendChild(invite)
    teamLobbyBox.appendChild(players)
    teamLobbyBox.appendChild(playerRow)
  })

Pusher.logToConsole = true;

var pusher = new Pusher('3aa26893ee89f046e2a3', {
  encrypted: true
})

var channel = pusher.subscribe('team_' + teamId)
channel.bind('player_joined', function(data) {
  addPlayer(data)
  playerAction(data, 'joined')
})

channel.bind('player_left', function(data) {
  removePlayer(data)
  playerAction(data, 'left')
})

function removePlayer(player) {
  playerIds = playerIds.filter(function(playerId){
    return playerId != player.id
  })

  document.getElementById('player' + player.id).remove()
}

function addPlayer(player) {
  if (!playerIds.includes(player.id)){
    playerIds.push(player.id)
    var playerBox = document.createElement('div')
    playerBox.classList.add('column', 'column-10')
    playerBox.setAttribute('id', 'player' + player.id)

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

function playerAction (player, action) {
  var chatList = document.getElementById('chat-list')

  var chatItem = document.createElement('li')
  chatItem.classList.add('chat-item', 'player-action')
  chatItem.innerHTML = player.username + " has " + action + " the party."

  chatList.appendChild(chatItem)
}
