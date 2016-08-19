fetch('/api/v1/games')
  .then(function(response) {
    return response.json()
  })

  //Take the JSON object, and begin creating HTML elements
  .then(function(json) {
    json.forEach(function(result){

      //Create the image element, and add a specific class
      var img = document.createElement('img')
      img.setAttribute('src', './assets/images/games/' + result.cover)
      img.classList.add('tile-img')

      //Create the title element, and add a specific class
      var title = document.createElement('h1')
      title.innerHTML = result.title
      title.classList.add('tile-title')

      //Create the div to house all the elements
      var tile = document.createElement('a')
      tile.classList.add('game-tile', 'column', 'column-20')

      //Add all the above elements to the final div container
      tile.appendChild(img)
      tile.appendChild(title)

      //Append the div to the master tile grid
      document.getElementById('games').appendChild(tile)
    })
  })
