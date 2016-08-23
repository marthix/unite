fetch('/api/v1/games' + window.location.search)
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json) {

    var title = document.getElementById('game-title')
    title.innerHTML = json.title

    console.log(json)

    json.teams.forEach(function(team){
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

  // Dynamically create modal
    var modalForm = document.createElement('form')
    modalForm.classList.add('modal-form')
    var modalFieldset = document.createElement('fieldset')

    var labelMode = document.createElement('label')
    labelMode.setAttribute('for', 'gameMode')
    labelMode.innerHTML = 'Choose your game mode:'

    var selectMode = document.createElement('select')
    selectMode.setAttribute('id', 'gameMode')

    json.modes.forEach(function(mode){
      var optionMode = document.createElement('option')
      optionMode.setAttribute('value', mode.id)
      optionMode.innerHTML = mode.name

      selectMode.appendChild(optionMode)
    })

    var labelSeriousness = document.createElement('label')
    labelSeriousness.setAttribute('for', 'gameSeriousness')
    labelSeriousness.innerHTML = 'How serious is your team?'

    var radiosBox = document.createElement('fieldset')
    radiosBox.setAttribute('id', 'radios')

    var input1 = document.createElement('input')
    input1.setAttribute('id', 'option1')
    input1.setAttribute('name', 'options')
    input1.setAttribute('type', 'radio')
    input1.setAttribute('value', '1')
    input1.classList.add('seriousness-input')

    var label1 = document.createElement('label')
    label1.setAttribute('for', 'option1')
    label1.innerHTML = 'Casual'

    var input2 = document.createElement('input')
    input2.setAttribute('id', 'option2')
    input2.setAttribute('name', 'options')
    input2.setAttribute('type', 'radio')
    input2.setAttribute('value', '2')
    input2.classList.add('seriousness-input')

    var label2 = document.createElement('label')
    label2.setAttribute('for', 'option2')
    label2.innerHTML = 'Semi-Casual'

    var input3 = document.createElement('input')
    input3.setAttribute('id', 'option3')
    input3.setAttribute('name', 'options')
    input3.setAttribute('type', 'radio')
    input3.setAttribute('value', '3')
    input3.classList.add('seriousness-input')
    input3.checked = true

    var label3 = document.createElement('label')
    label3.setAttribute('for', 'option3')
    label3.innerHTML = 'Neutral'

    var input4 = document.createElement('input')
    input4.setAttribute('id', 'option4')
    input4.setAttribute('name', 'options')
    input4.setAttribute('type', 'radio')
    input4.setAttribute('value', '4')
    input4.classList.add('seriousness-input')

    var label4 = document.createElement('label')
    label4.setAttribute('for', 'option4')
    label4.innerHTML = 'Semi-Hardcore'

    var input5 = document.createElement('input')
    input5.setAttribute('id', 'option5')
    input5.setAttribute('name', 'options')
    input5.setAttribute('type', 'radio')
    input5.setAttribute('value', '5')
    input5.classList.add('seriousness-input')

    var label5 = document.createElement('label')
    label5.setAttribute('for', 'option5')
    label5.innerHTML = 'Hardcore'

    radiosBox.appendChild(input1)
    radiosBox.appendChild(label1)
    radiosBox.appendChild(input2)
    radiosBox.appendChild(label2)
    radiosBox.appendChild(input3)
    radiosBox.appendChild(label3)
    radiosBox.appendChild(input4)
    radiosBox.appendChild(label4)
    radiosBox.appendChild(input5)
    radiosBox.appendChild(label5)

    var labelDescription = document.createElement('label')
    labelDescription.setAttribute('for', 'teamDescription')
    labelDescription.innerHTML = 'Enter a description for your team:'

    var inputDescription = document.createElement('input')
    inputDescription.setAttribute('id', 'teamDescription')
    inputDescription.setAttribute('type', 'text')

    modalFieldset.appendChild(labelMode)
    modalFieldset.appendChild(selectMode)
    modalFieldset.appendChild(labelSeriousness)
    modalFieldset.appendChild(radiosBox)
    modalFieldset.appendChild(labelDescription)
    modalFieldset.appendChild(inputDescription)

    modalForm.appendChild(modalFieldset)

    document.getElementById('grabMe').appendChild(modalForm)

    new jBox('Modal', {
        width: '50vw',
        height: '70vh',
        attach: $('.create-team'),
        title: 'Create a team for ' + json.title,
        content: $('#grabMe'),
        addClass: 'create-modal'
    })

    $("#radios").radiosToSlider({
        animation: true
    })
  })



{/* <div id="radios">
    <input id="option1" name="options" type="radio">
    <label for="option1">1 year</label>
    <input id="option2" name="options" type="radio">
    <label for="option2">2 years</label>
    <input id="option3" name="options" type="radio" checked>
    <label for="option3">3 years</label>
    <input id="option4" name="options" type="radio">
    <label for="option4">4 years</label>
    <input id="option5" name="options" type="radio">
    <label for="option5">5+ years</label>
</div> */}
  // <form>
  //   <fieldset>
  //     <label for="nameField">Name</label>
  //     <input type="text" placeholder="CJ Patoilo" id="nameField">
  //     <label for="ageRangeField">Age Range</label>
  //     <select id="ageRangeField">
  //       <option value="0-13">0-13</option>
  //       <option value="14-17">14-17</option>
  //       <option value="18-23">18-23</option>
  //       <option value="24+">24+</option>
  //     </select>
  //     <label for="commentField">Comment</label>
  //     <textarea placeholder="Hi CJ …" id="commentField"></textarea>
  //     <div class="example-send-yourself-copy">
  //       <input type="checkbox" id="confirmField">
  //       <label class="label-inline" for="confirmField">Send a copy to yourself</label>
  //     </div>
  //     <input class="button-primary" type="submit" value="Send">
  //   </fieldset>
  // </form>
