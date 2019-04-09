document.addEventListener('DOMContentLoaded', () => {

  // application state
  let toysArr = []

  // DOM elements:
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollectionDiv = document.querySelector('#toy-collection')

  let addToy = false

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      toyForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let newToyName = e.target.elements['name'].value
        let newToyImage = e.target.elements['image'].value
        addNewToy(newToyName, newToyImage)
        toyForm.style.display = 'none'
        addToy = !addToy
      })
    } else {
      toyForm.style.display = 'none'
    }
  })

  toyCollectionDiv.addEventListener('click', addLikes)
  toyCollectionDiv.addEventListener('click', deleteToy)

  function addLikes(e) {
    if ("like-btn" === e.target.className) {
      const likes = parseInt(e.target.parentNode.querySelector('p').innerText.split(" ")[0]) + 1
      const toyId = e.target.parentNode.dataset.id
      // let foundToy = toysArr.find(toy => toy.id === toyId)
      // console.log(foundToy);
      // foundToy.likes++
      fetchAddLikes(likes, toyId)
    }
  }

  function deleteToy(e) {
    if ("delete-btn" === e.target.className) {
      const toyId = e.target.parentNode.dataset.id
      fetchDeleteToy(toyId)
    }
  }

  function fetchDeleteToy(toyId) {
    return fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
      let foundToy = toysArr.find(toy => parseInt(toy.id) === parseInt(toyId))
      let index = toysArr.indexOf(foundToy)
      toysArr.splice(index, 1)
      renderAllToyCards()
    })

  }

  function fetchAddLikes(likes, toyId) {
    return fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        likes: likes
      })
    })
    .then(res => res.json())
    .then(data => {
      let foundToy = toysArr.find(toy => parseInt(toy.id) === parseInt(toyId))
      foundToy.likes++
      renderAllToyCards()
    })

  }


  // fetches:
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(data => {
      toysArr = data
      renderAllToyCards()
    })

  function addNewToy(newToyName, newToyImage) {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newToyName,
        image: newToyImage,
        likes: 0
      })
    })
    .then(res => res.json())
    .then(data => {
      toysArr.push(data)
      renderAllToyCards()
    })
  }

  // render all toy cards
  function renderAllToyCards() {
    toyCollectionDiv.innerHTML = ''
    toysArr.forEach(toy => {
      toyCollectionDiv.innerHTML += renderToyCard(toy)
    })
  }

  // render a single toy card
  function renderToyCard(toy) {
    return `
      <div class="card" data-id="${toy.id}">
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes </p>
        <button class="like-btn">Like <3</button>
        <button class="delete-btn">Delete</button>
      </div>
    `
  }


})
