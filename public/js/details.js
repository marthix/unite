fetch('/api/v1/games' + window.location.search)
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json) {
    // console.log(json)

    var title = document.getElementById('game-title')
    title.innerHTML = json.title

    json.teams.forEach(function(team){
      console.log(team)
      var boundingBox = document.createElement('div')
      boundingBox.classList.add('column', 'column-33')

      var teamTile = document.createElement('div')
      teamTile.classList.add('team-tile')

      var teamRow = document.createElement('div')
      teamRow.classList.add('row')

      var teamPlayerBox = document.createElement('div')
      teamPlayerBox.classList.add('column', 'column-80')

      var teamPlayerRow = document.createElement('div')
      teamPlayerRow.classList.add('row', 'team-players')

      // LOOP THROUGH EACH PLAYER FOR AVATARS
      team.user.forEach(function(user){
        var avatarBox = document.createElement('div')
        avatarBox.classList.add('column', 'column-20', 'popover-team-avatar')

        var avatar = document.createElement('img')
        avatar.setAttribute('src', 'https://discordapp.com/api/users/' + user.discord_id + '/avatars/' + user.avatar + '.jpg')
        avatar.classList.add('team-avatar')

        var playerPopover = document.createElement('span')
        playerPopover.classList.add('popover')
        playerPopover.innerHTML = user.username_full

        avatarBox.appendChild(avatar)
        avatarBox.appendChild(playerPopover)

        teamPlayerRow.appendChild(avatarBox)
      })



      var teamSizeBox = document.createElement('div')
      teamSizeBox.classList.add('column', 'column-20')

      var teamSize = document.createElement('h5')
      teamSize.classList.add('team-size')
      teamSize.innerHTML = team.user.length + '/' + team.mode.size


      var seriousnessLabel = document.createElement('label')
      seriousnessLabel.setAttribute('for', 'seriousness' + team.id)
      seriousnessLabel.innerHTML = 'Casual to Competitive'

      var seriousnessInput = document.createElement('input')
      seriousnessInput.setAttribute('type', 'range')
      seriousnessInput.setAttribute('min', '1')
      seriousnessInput.setAttribute('max', '5')
      seriousnessInput.setAttribute('value', team.seriousness)
      seriousnessInput.setAttribute('id', 'seriousness' + team.id)
      seriousnessInput.setAttribute('step', '1')
      seriousnessInput.setAttribute('list', 'settings' + team.id)
      seriousnessInput.setAttribute('disabled', 'true')

      var datalist = document.createElement('datalist')
      datalist.setAttribute('id', 'settings' + team.id)
      datalist.innerHTML = '<option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>'

      var infoRow = document.createElement('div')
      infoRow.classList.add('row')

      var infoBox = document.createElement('div')
      infoBox.classList.add('column', 'column-20', 'popover-team-description')

      var infoPopover = document.createElement('span')
      infoPopover.classList.add('popover')
      infoPopover.innerHTML = team.description

      fetch('/assets/images/info.svg')
        .then(function(response){
          response.text().then(function(svg){
            infoBox.innerHTML = svg
            infoBox.appendChild(infoPopover)
          })
        })

      var gameModeBox = document.createElement('div')
      gameModeBox.classList.add('column', 'column-40')

      var gameMode = document.createElement('h5')
      gameMode.classList.add('game-mode')
      gameMode.innerHTML = team.mode.name

      var joinBox = document.createElement('div')
      joinBox.classList.add('column', 'column-40')

      var joinLink = document.createElement('a')
      joinLink.classList.add('button', 'button-outline', 'join')

      var joinText = document.createElement('span')

      if(team.access === 'false') {
        fetch('/assets/images/door-closed.svg')
        .then(function(response){
          response.text().then(function(svg){
            joinLink.innerHTML = svg
            joinLink.appendChild(joinText)
          })
        })
        joinText.innerHTML = 'APPLY'
      } else {
        fetch('/assets/images/door-open.svg')
        .then(function(response){
          response.text().then(function(svg){
            joinLink.innerHTML = svg
            joinLink.appendChild(joinText)
          })
        })
        joinText.innerHTML = 'JOIN'
      }

      teamPlayerBox.appendChild(teamPlayerRow)
      teamSizeBox.appendChild(teamSize)

      teamRow.appendChild(teamPlayerBox)
      teamRow.appendChild(teamSizeBox)

      gameModeBox.appendChild(gameMode)

      joinBox.appendChild(joinLink)

      infoRow.appendChild(infoBox)
      infoRow.appendChild(gameModeBox)
      infoRow.appendChild(joinBox)

      teamTile.appendChild(teamRow)
      teamTile.appendChild(seriousnessLabel)
      teamTile.appendChild(seriousnessInput)
      teamTile.appendChild(datalist)
      teamTile.appendChild(infoRow)

      boundingBox.appendChild(teamTile)

      document.getElementById('teams').appendChild(boundingBox)
    })
  })

// access: "true"
// created_at: null
// description: "We're a casual group who loves to play any and all Smite."
// game_id: 4
// id: 1
// invite: null
// mode_id: 1
// seriousness: 1
// size: 5
// updated_at: null
