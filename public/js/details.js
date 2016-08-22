fetch('/api/v1/games' + window.location.search)
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json) {
    console.log(json)

    var title = document.getElementById('game-title')
    title.innerHTML = json.title

    json.teams.forEach(function(team){
      console.log(team)
    })
  })
