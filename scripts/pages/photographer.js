// Dom

const header = document.querySelector('.photographe-header')
const main = document.querySelector('main')
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

let likedMedia = []

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

      const dataPhotographe = data.photographers.find((e) => e.id === parseInt(id))
      const mediaPhotographe = data.media.filter((e) => e.photographerId === parseInt(id))

      return {
        dataPhotographe,
        mediaPhotographe
      }
    })

async function init () {
  const { dataPhotographe, mediaPhotographe } = await fetchPhotographePage()

  header.innerHTML = `
      <div tabindex='1' >
        <h1 tabindex='1' aria-label="Le nom du photographe est ${dataPhotographe.name}" class='titre'>${dataPhotographe.name}</h1>
        <h2 tabindex='1' aria-label="La ville du photographe est ${dataPhotographe.city} en ${dataPhotographe.country}" >${dataPhotographe.city}, ${dataPhotographe.country}</h2>
        <p tabindex='1' aria-label="Le slogan du photographe est ${dataPhotographe.tagline}" >${dataPhotographe.tagline}</p>
      </div>
      <button aria-label"button ouvrir le formulaire de contact" class="contact_button" onclick="displayModal()">Contactez-moi</button>
      <img tabindex='2' src="/assets/photographers/${dataPhotographe.portrait}" alt="${dataPhotographe.alt}">
`
  displayLikePrice(dataPhotographe, mediaPhotographe)
  displayGallery(mediaPhotographe)

  modalH2.innerText = `Contactez-moi ${dataPhotographe.name}`

  selectChoices.forEach((selectChoice) => {
    selectChoice.addEventListener('click', (e) => {
      const choice = e.currentTarget.dataset.orderBy

      displayGallery(mediaPhotographe, choice)
    })
  })
}
init()

// Création de cartes da la gallery
function createMediaCard (e, i) {
  const regex = /_/gi
  let htmlElement = ''
  if (!('image' in e)) {
    htmlElement = `
  <article class="card">
  <a>
    <i class="fas fa-play"></i>
    <video id="${i}" data-titre="${e.video
      .replace('.mp4', ' ')
      .replace(regex, ' ')}" class="video" aria-label="${e.alt}" src="/assets/gallery/${
      e.video
    }">
    </video>
  </a>
  <div class="card-header">
    <h2>${e.video.replace('.mp4', ' ').replace(regex, ' ')}</h2>
    <div class="card-header-like">
      <span tabindex='0' aria-label="${e.likes} nombres de j'aime"   id='${e.likes}' class="counter">${e.likes}</span>
      <i id='${e.likes}' class="fas fa-heart likes"></i>
    </div>
  </div>
  </article>
`
  } else {
    htmlElement = `
    <article class="card">
    
    <img id="${i}" data-titre="${e.title}" class="image" src="/assets/gallery/${e.image}" alt="${
      e.alt
    }">
    
    <div class="card-header">
    <h2>${e.title}</h2>
    <div class="card-header-like">
      <span tabindex='0' aria-label="${e.likes} nombres de j'aime" id='${e.likes}' class="counter">${e.likes}</span>
      <i id='${e.likes}' class="fas fa-heart likes"></i>
    </div>
    </div>
    </article>
    `
  }

  return htmlElement
}

// Trie des photos et video par titre, date et j'aime
function sortByTitle (a, b) {
  return a.title > b.title ? 1 : -1
}
function sortByDate (a, b) {
  return Date.parse(a.date) - Date.parse(b.date)
}
function sortByLikes (a, b) {
  return b.likes - a.likes
}

// Affichage de la gallery
function displayGallery (mediaPhotographe, orderBy = 'likes') {
  gallery.innerHTML = ''

  const sortFunctions = {
    title: sortByTitle,
    date: sortByDate,
    likes: sortByLikes
  }
  const sortBy = sortFunctions[orderBy]

  mediaPhotographe.sort(sortBy).forEach((e, i) => {
    gallery.innerHTML += createMediaCard(e, i)

    // Systeme de like
    onLike()

    const img = document.querySelectorAll('.image')
    const movie = document.querySelectorAll('.video')

    //  Apparition de la lightbox en fonction du clic sur une image ou video
    img.forEach((image) => {
      image.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          lightbox.style.display = 'flex'
          main.setAttribute('aria-hidden', 'true')
          header.setAttribute('aria-hidden', 'true')
        }
      })
      image.addEventListener('click', (e) => {
        main.setAttribute('aria-hidden', 'true')
        header.setAttribute('aria-hidden', 'true')

        lightboxImg.innerHTML = `
          <img src="${e.target.attributes[3].nodeValue}" alt="${e.target.alt}">
          <h2>${e.target.dataset.titre}</h2>
          `

        i = parseInt(e.target.id)
        lightbox.style.display = 'flex'

        btnNext(i, mediaPhotographe)
        btnPrev(i, mediaPhotographe)
      })
    })

    movie.forEach((video) => {
      video.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          lightboxImg.innerHTML = `
          <video controls>
          <source aria-label="${e.target.dataset.titre}" src="${e.target.attributes.src.nodeValue}"
          type="video/mp4">
          </video>
          <h2>${e.target.dataset.titre}</h2>           
          `
          lightbox.style.display = 'flex'
          i = parseInt(e.target.id)

          btnNext(i, mediaPhotographe)
          btnPrev(i, mediaPhotographe)
          main.setAttribute('aria-hidden', 'true')
          header.setAttribute('aria-hidden', 'true')
        }
      })
      video.addEventListener('click', (e) => {
        console.log(e)
        main.setAttribute('aria-hidden', 'true')
        header.setAttribute('aria-hidden', 'true')
        lightboxImg.innerHTML = `
            <video controls>
              <source aria-label="${e.target.dataset.titre}" src="${e.target.attributes.src.nodeValue}"
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

    // Fermeture de la lightbox au clic sur le bouton croix ou avec echape
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none'
      main.setAttribute('aria-hidden', 'false')
      header.setAttribute('aria-hidden', 'false')
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none'
        main.setAttribute('aria-hidden', 'false')
        header.setAttribute('aria-hidden', 'false')
      }
    })
  })
}

// Systeme de like, Ajout des likes au click
function onLike () {
  const counterLikes = document.querySelectorAll('.likes')
  const counter = document.querySelectorAll('.counter')
  const counterTotal = document.querySelectorAll('.counter-total')

  counterLikes.forEach(like => {
    like.addEventListener('click', (e) => {
      counter.forEach(count => {
        const target = likedMedia.find((element) => element === e.target.id)
        if (e.target.id === count.id) {
          if (!target) {
            count.textContent++
            counterTotal[0].textContent++
            likedMedia.push(e.target.id)
          } else {
            likedMedia = likedMedia.filter((element) => element !== e.target.id)

            count.textContent--
            counterTotal[0].textContent--
          }
        }
      })
    })
  })
}

// Affichage de l'encart de la totalité des likes
function displayLikePrice (dataPhoto, mediaPhotographe) {
  const likes = []
  // Récupearation des likes
  mediaPhotographe.forEach((e) => {
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

// Bouton suivant de la lightbox
function btnNext (i, mediaPhotographe) {
  const im = mediaPhotographe.map((e) => e.image)
  lightboxBtnNext.addEventListener('click', () => {
    i += 1

    if (i === im.length) {
      i = 0
    }

    displayNextPrevPicture(i, mediaPhotographe)
    btnPrev(i, mediaPhotographe)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      i += 1
      if (i === im.length) {
        i = 0
      }

      displayNextPrevPicture(i, mediaPhotographe)
      btnPrev(i, mediaPhotographe)
    }
  })
}

// Bouton precedent de la lightbox
function btnPrev (i, mediaPhotographe) {
  const im = mediaPhotographe.map((e) => e.image)
  lightboxBtnPrev.addEventListener('click', () => {
    i -= 1
    if (i < 0) {
      i = im.length - 1
    }
    displayNextPrevPicture(i, mediaPhotographe)
    btnNext(i, mediaPhotographe)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      i -= 1
      if (i < 0) {
        i = im.length - 1
      }

      displayNextPrevPicture(i, mediaPhotographe)
      btnNext(i, mediaPhotographe)
    }
  })
}

// Creation des cartes photos ou video en fonction du click suivant ou precedent
function displayNextPrevPicture (i, mediaPhotographe) {
  const regex = /_/gi

  const im = mediaPhotographe.map((e) => e.image)
  const v = mediaPhotographe.map((e) => e.video)
  const title = mediaPhotographe.map((e) => e.title)
  const alt = mediaPhotographe.map((e) => e.alt)

  if (im[i]) {
    lightboxImg.innerHTML = `
        <img src="/assets/gallery/${im[i]}"  alt="${alt[i]}">
        <h2>${title[i]}</h2>
        `
  }

  if (im[i] === undefined) {
    lightboxImg.innerHTML = `
    <video controls>
    <source aria-label="${v[i].replace('.mp4', ' ').replace(regex, ' ')}" src="/assets/gallery/${v[i]}"
    type="video/mp4">
    </video>
  <h2>${v[i].replace('.mp4', ' ').replace(regex, ' ')}</h2>

    `
  }
}

// Evenements sur le bouton filtre par date, like ou titre
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
filterButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    filterChoice.style.display = 'block'
    filterButton.style.display = 'none'
    chevron.classList.remove('fa-chevron-down')
    chevron.classList.add('fa-chevron-up')
  }
})
filterChoice.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    filterChoice.setAttribute('aria-activedescendant', 'filter-date')
  }
})
