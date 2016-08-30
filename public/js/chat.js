var teamId = window.location.search.replace('?id=', '')

fetch('/api/v1/teams?id=' + teamId, {
  credentials: 'include'
})
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json){
    console.log(json)

    var chatContainer = document.getElementById('chat-box')

    var chatBox = document.createElement('div')
    chatBox.classList.add('chat')

    var chatInputBox = document.createElement('div')
    chatInputBox.classList.add('chat-input-box')

    var chatInput = document.createElement('input')
    chatInput.classList.add('chat-input')

    var chatButton = document.createElement('button')
    chatButton.classList.add('button', 'chat-button')
    chatButton.innerHTML = 'SEND'

    chatInputBox.appendChild(chatInput)
    chatInputBox.appendChild(chatButton)

    chatContainer.appendChild(chatBox)
    chatContainer.appendChild(chatInputBox)
  })


Pusher.logToConsole = true;

channel.bind('chat', function(data) {

})
