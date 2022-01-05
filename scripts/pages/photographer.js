// Dom

const header = document.querySelector('.photographe-header')
const gallery = document.querySelector('.media')
const likeAndPrice = document.querySelector('.likes-price')
const filterButton = document.querySelector('.filter-label')
const filterChoice = document.querySelector('.filter-wrapper')
const selectChoices = document.querySelectorAll('.filter-listbox-option')
const chevron = document.querySelector('.chevron')
const lightbox = document.querySelector('.lightbox')
const lightboxClose = document.querySelector('.fa-times')
const lightboxImg = document.querySelector('.lightbox-img')
const lightboxBtnPrev = document.querySelector('.fa-chevron-left')
const lightboxBtnNext = document.querySelector('.fa-chevron-right')

const modalH2 = document.querySelector('.modal header h2')
console.log(modalH2)

// Recuperation de la chaine de caractere dans l'url
const urlId = window.location.search

// Extraction de l'id
const id = urlId.slice(1)

// Récupération des données json

const fetchPhotographePage = async () =>
  await fetch('data/photographers.json')
    .then((res) => res.json())
    .then((data) => {
      // trouver l'id de data egale a l'id de l'url

      const dataPhotographe = data.photographers.find((e) => e.id == id)
      const mediaPhotographe = data.media.filter((e) => e.photographerId == id)
      console.log(dataPhotographe)
      return {
        dataPhotographe,
        mediaPhotographe
      }
    })

async function init () {
  const { dataPhotographe, mediaPhotographe } = await fetchPhotographePage()

  console.log(mediaPhotographe.map((e) => e.image))
  console.log(dataPhotographe.name)
  header.innerHTML = `
      <div>
        <h1 class='titre'>${dataPhotographe.name}</h1>
        <h2>${dataPhotographe.city}, ${dataPhotographe.country}</h2>
        <p>${dataPhotographe.tagline}</p>
      </div>
      <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
      <img src="/assets/photographers/${dataPhotographe.portrait}" alt="">
`
  displayLikePrice(dataPhotographe, mediaPhotographe)
  displayGallery(mediaPhotographe)

  modalH2.innerText = `Contactez-moi ${dataPhotographe.name}`

  selectChoices.forEach((selectChoice) => {
    selectChoice.addEventListener('click', (e) => {
      const choice = e.currentTarget.dataset.orderBy
      console.log(choice)
      displayGallery(mediaPhotographe, choice)
    })
  })
}
init()

function sortByTitle (a, b) {
  return a.title > b.title ? 1 : -1
}
function sortByDate (a, b) {
  return Date.parse(a.date) - Date.parse(b.date)
}
function sortByLikes (a, b) {
  return b.likes - a.likes
}

function displayGallery (mediaPhotographe, orderBy = 'likes') {
  const regex = /_/gi
  gallery.innerHTML = ''

  const sortFunctions = {
    title: sortByTitle,
    date: sortByDate,
    likes: sortByLikes
  }
  const sortBy = sortFunctions[orderBy]
  let i = 0

  mediaPhotographe.sort(sortBy).map((e) => {
    if (e.image == undefined) {
      gallery.innerHTML += `
    <article class="card">
    <a>
      <i class="fas fa-play"></i>
      <video id="${i++}" data-titre="${e.video
        .replace('.mp4', ' ')
        .replace(regex, ' ')}" class="video" src="/assets/gallery/${
        e.video
      }"></video>
    </a>
    <div class="card-header">
      <h2>${e.video.replace('.mp4', ' ').replace(regex, ' ')}</h2>
      <div class="card-header-like">
        <span id='${e.likes}' class="counter">${e.likes}</span>
        <i id='${e.likes}' class="fas fa-heart likes"></i>
      </div>
    </div>
    </article>
`
    } else {
      gallery.innerHTML += `
      <article class="card">
      
      <img id="${i++}" class="image" src="/assets/gallery/${e.image}" alt="${
        e.title
      }">
      
      <div class="card-header">
      <h2>${e.title}</h2>
      <div class="card-header-like">
      <span id='${e.likes}' class="counter">${e.likes}</span>
      <i id='${e.likes}' class="fas fa-heart likes"></i>
      </div>
      </div>
      </article>
      `
    }
    onLike(e)

    const img = document.querySelectorAll('.image')
    const movie = document.querySelectorAll('.video')

    img.forEach((image) => {
      image.addEventListener('click', (e) => {
        // Récuperer l'id dans img et mettre la fonction next(id)
        lightboxImg.innerHTML = `
          <img src="${e.originalTarget.src}" alt="">
          <h2>${e.originalTarget.alt}</h2>
          `
        i = parseInt(e.target.id)
        lightbox.style.display = 'flex'

        btnNext(i, mediaPhotographe)
        btnPrev(i, mediaPhotographe)
      })
    })

    movie.forEach((video) => {
      video.addEventListener('click', (e) => {
        console.log(e.target.attributes.src.nodeValue)
        lightboxImg.innerHTML = `
            <video controls>
            <source src="${e.target.attributes.src.nodeValue}"
            type="video/mp4">
            </video>
            <h2>${e.target.dataset.titre}</h2>           
            `

        lightbox.style.display = 'flex'
        i = parseInt(e.target.id)

        btnNext(i, mediaPhotographe)
        btnPrev(i, mediaPhotographe)
      })
    })

    // Evenement modal lightbox
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none'
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none'
      }
    })
  })
}
function onLike (e) {
  const counterLikes = document.querySelectorAll('.likes')
  const counter = document.querySelectorAll('.counter')
  const counterTotal = document.querySelectorAll('.counter-total')
  console.log(counterTotal[0])
  counterTotal.forEach(el => {
    console.log(el)
  })

  let counterLikeClick = 0

  counterLikes.forEach(like => {
    like.addEventListener('click', (e) => {
      console.log(e.target.id)
      counter.forEach(count => {
        if (e.target.id === count.id) {
          if (counterLikeClick === 0) {
            counterLikeClick += 1
            count.textContent++
            counterTotal[0].textContent++
          } else {
            counterLikeClick -= 1
            count.textContent--
            counterTotal[0].textContent--
          }
        }
      })
    })
  })
}

function displayLikePrice (dataPhoto, mediaPhotographe) {
  const likes = []
  // Récupearation des likes
  mediaPhotographe.map((e) => {
    likes.push(e.likes)
  })
  // Addition de tous les likes dans une variable totalLikes
  const reducer = (acc, cur) => acc + cur
  const totalLikes = likes.reduce(reducer)

  // Injection du html avec les données du fichier json
  return (likeAndPrice.innerHTML = `
    <div class="likes-price-like">
          <span class="counter-total">${totalLikes}</span>
          <i class="fas fa-heart black"></i>
    </div>
        <p>${dataPhoto.price}€ / jour</p>
    
    `)
}

filterButton.addEventListener('click', () => {
  filterChoice.style.display = 'block'
  filterButton.style.display = 'none'
  chevron.classList.remove('fa-chevron-down')
  chevron.classList.add('fa-chevron-up')
})

filterChoice.addEventListener('click', (e) => {
  filterChoice.style.display = 'none'
  filterButton.style.display = 'block'
  filterButton.innerText = e.target.innerText.trim()
  chevron.classList.remove('fa-chevron-up')
  chevron.classList.add('fa-chevron-down')
})

function btnNext (i, mediaPhotographe) {
  const im = mediaPhotographe.map((e) => e.image)
  lightboxBtnNext.addEventListener('click', () => {
    i += 1

    if (i == im.length) {
      i = 0
    }

    displayNextPrevPicture(i, mediaPhotographe)
    btnPrev(i, mediaPhotographe)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      i += 1
      if (i == im.length) {
        i = 0
      }

      displayNextPrevPicture(i, mediaPhotographe)
    }
  })
}

function btnPrev (i, mediaPhotographe) {
  const im = mediaPhotographe.map((e) => e.image)
  lightboxBtnPrev.addEventListener('click', () => {
    i -= 1
    if (i < 0) {
      i = im.length - 1
    }
    displayNextPrevPicture(i, mediaPhotographe)
    btnNext(i, mediaPhotographe)
    console.log(i)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      i -= 1
      if (i < 0) {
        i = im.length - 1
      }

      displayNextPrevPicture(i, mediaPhotographe)
    }
  })
}

function displayNextPrevPicture (i, mediaPhotographe) {
  const regex = /_/gi

  const im = mediaPhotographe.map((e) => e.image)
  const v = mediaPhotographe.map((e) => e.video)
  const title = mediaPhotographe.map((e) => e.title)

  lightboxImg.innerHTML = `
        <img src="/assets/gallery/${im[i]}"  alt="">
        <h2>${title[i]}</h2>
        `

  if (im[i] == undefined) {
    lightboxImg.innerHTML = `
    <video controls>
    <source src="/assets/gallery/${v[i]}"
    type="video/mp4">
    </video>
  <h2>${v[i].replace('.mp4', ' ').replace(regex, ' ')}</h2>

    `
  }
}
