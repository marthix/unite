// Pusher to send chats
channel.bind('message', function(data) {
  renderChat(data)
})

//Setup the structure for chatting
var chatContainer = document.createElement('div')
chatContainer.classList.add('column', 'column-25')
chatContainer.setAttribute('id', 'chat-box')

var chatBox = document.createElement('div')
chatBox.classList.add('chat')

var chatList = document.createElement('ul')
chatList.setAttribute('id', 'chat-list')

var chatInputBox = document.createElement('div')
chatInputBox.classList.add('chat-input-box')

var chatInput = document.createElement('textarea')
chatInput.classList.add('chat-input')
chatInput.setAttribute('maxlength', '200')

var chatButton = document.createElement('button')
chatButton.classList.add('button', 'chat-button')
chatButton.innerHTML = 'SEND'

chatBox.appendChild(chatList)

chatInputBox.appendChild(chatInput)
chatInputBox.appendChild(chatButton)

chatContainer.appendChild(chatBox)
chatContainer.appendChild(chatInputBox)

document.getElementById('team-lobby').appendChild(chatContainer)

// Event listener for typing
chatInput.addEventListener('keypress', function(e) {
  if(e.keyCode === 13 && chatInput.value != '') {
    e.preventDefault()
    fetchAPI(chatInput.value)
  }
})

document.body.addEventListener('click', function(e) {
  if(e.target === chatButton) {
    chatButton.blur()
  }

  if(e.target === chatButton && chatInput.value != '') {
    var message = chatInput.value
    fetchAPI(message)
  }
})


// Utility functions
function fetchAPI (message) {
  clearChat()
  fetch('/api/v1/chat', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      team_id: window.location.search.replace('?id=', ''),
      message: message,
      username: user.username_full,
      avatar: user.avatar,
      discord_id: user.discord_id
    })
  })
}

function renderChat (data) {
  var chatList = document.getElementById('chat-list')

  var chatItem = document.createElement('li')
  chatItem.classList.add('chat-item', 'row')

  var avatarContainer = document.createElement('div')
  avatarContainer.classList.add('column', 'column-20')

  var avatar = document.createElement('img')
  avatar.classList.add('avatar')
  avatar.setAttribute('src', 'https://discordapp.com/api/users/' + data.discord_id + '/avatars/' + data.avatar + '.jpg')
  avatar.setAttribute('width', '100%')

  var messageContainer = document.createElement('div')
  messageContainer.classList.add('column', 'column-80')

  var name = document.createElement('p')
  name.classList.add('chat-name')
  name.innerHTML = data.username

  var message = document.createElement('p')
  message.classList.add('chat-message')
  message.innerHTML = data.message

  avatarContainer.appendChild(avatar)
  messageContainer.appendChild(name)
  messageContainer.appendChild(message)

  chatItem.appendChild(avatarContainer)
  chatItem.appendChild(messageContainer)

  chatList.appendChild(chatItem)
  scrollChat()
}

function clearChat () {
  chatInput.value = ''
}

function scrollChat () {
  chatBox.scrollTop = chatBox.scrollHeight
}
