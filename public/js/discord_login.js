document.body.addEventListener('click', function(e){
  console.log('click')
  if(e.target.id === 'discord-login'){
    console.log(window.location)
  }
})
