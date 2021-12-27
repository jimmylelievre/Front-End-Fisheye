//Dom
const header = document.querySelector(".photographe-header");
const gallery = document.querySelector(".media");
const likeAndPrice = document.querySelector(".likes-price");
const filterButton = document.querySelector(".filter-label");
const filterChoice = document.querySelector(".filter-wrapper");
const selectChoices = document.querySelectorAll(".filter-listbox-option");
const chevron = document.querySelector(".chevron");
const lightbox = document.querySelector(".lightbox");
const lightboxClose = document.querySelector(".fa-times");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxBtnPrev = document.querySelector(".fa-chevron-left");
const lightboxBtnNext = document.querySelector(".fa-chevron-right");

// Recuperation de la chaine de caractere dans l'url
const urlId = window.location.search;

console.log(urlId);

// Extraction de l'id
const id = urlId.slice(1);
console.log(id);

// Récupération des données json

const fetchPhotographePage = async () => {
  return await fetch("data/photographers.json")
    .then((res) => res.json())
    .then((data) => {
      // trouver l'id de data egale a l'id de l'url
      dataPhotographe = data.photographers.find((e) => e.id == id);
      mediaPhotographe = data.media.filter((e) => e.photographerId == id);
      console.log(mediaPhotographe);
      return {
        dataPhotographe,
        mediaPhotographe,
      };
    });
};

async function init() {
  let { dataPhotographe, mediaPhotographe } = await fetchPhotographePage();

  console.log(mediaPhotographe.map((e) => e.image));
  console.log(dataPhotographe.name);
  header.innerHTML = `
      <div>
        <h1 class='titre'>${dataPhotographe.name}</h1>
        <h2>${dataPhotographe.city}, ${dataPhotographe.country}</h2>
        <p>${dataPhotographe.tagline}</p>
      </div>
      <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
      <img src="/assets/photographers/${dataPhotographe.portrait}" alt="">
`;
  displayLikePrice(dataPhotographe, mediaPhotographe);
  displayGallery(mediaPhotographe);

  selectChoices.forEach((selectChoice) => {
    selectChoice.addEventListener("click", (e) => {
      let choice = e.currentTarget.dataset.orderBy;
      console.log(choice);
      displayGallery(mediaPhotographe, choice);
    });
  });

  const regex = /_/gi;

  let i = 0;
  lightboxBtnNext.addEventListener("click", () => {
    i = i + 1;
    im = mediaPhotographe.map((e) => e.image);
    v = mediaPhotographe.map((e) => e.video);
    title = mediaPhotographe.map((e) => e.title);

    console.log(im[i]);
    lightboxImg.innerHTML = `
          <img src="/assets/gallery/${im[i]}"  alt="">
          <h2>${title[i]}</h2>

          `;
    if (i == im.length) {
      i = 0;
      lightboxImg.innerHTML = `
          <img src="/assets/gallery/${im[i]}"  alt="">
          <h2>${title[i]}</h2>

          `;
    }
    if (im[i] == undefined) {
      lightboxImg.innerHTML = `
            <video controls>
            <source src="/assets/gallery/${v[i]}"
            type="video/mp4">
            </video>
          <h2>${v[i].replace(".mp4", " ").replace(regex, " ")}</h2>
           
            `;
    }

    console.log(i);
  });

  lightboxBtnPrev.addEventListener("click", () => {
    i = i - 1;
    im = mediaPhotographe.map((e) => e.image);
    v = mediaPhotographe.map((e) => e.video);
    title = mediaPhotographe.map((e) => e.title);

    console.log(v);
    lightboxImg.innerHTML = `
          <img src="/assets/gallery/${im[i]}"  alt="">
          <h2>${title[i]}</h2>
          `;

    if (im[i] == undefined) {
      lightboxImg.innerHTML = `
            <video controls>
            <source src="/assets/gallery/${v[6]}"
            type="video/mp4">
            </video>
          <h2>${v[6].replace(".mp4", " ").replace(regex, " ")}</h2>
           
            `;
    }
    if (i < 0) {
      i = im.length - 1;
      lightboxImg.innerHTML = `
      <img src="/assets/gallery/${im[i]}"  alt="">
      <h2>${title[i]}</h2>
      `;
    }
    console.log(i);
  });
}
init();

function sortByTitle(a, b) {
  return a.title > b.title ? 1 : -1;
}
function sortByDate(a, b) {
  return Date.parse(a.date) - Date.parse(b.date);
}
function sortByLikes(a, b) {
  return b.likes - a.likes;
}

function displayGallery(mediaPhotographe, orderBy = "likes") {
  const regex = /_/gi;
  gallery.innerHTML = "";

  let sortFunctions = {
    title: sortByTitle,
    date: sortByDate,
    likes: sortByLikes,
  };
  let sortBy = sortFunctions[orderBy];
  let i = 0;

  mediaPhotographe.sort(sortBy).map((e) => {
    if (e.image == undefined) {
      gallery.innerHTML += `
    <article class="card">
    <a>
      <i class="fas fa-play"></i>
      <video id="${e.video
        .replace(".mp4", " ")
        .replace(regex, " ")}" class="video" src="/assets/gallery/${
        e.video
      }"></video>
    </a>
    <div class="card-header">
      <h2>${e.video.replace(".mp4", " ").replace(regex, " ")}</h2>
      <div class="card-header-like">
        <span class="counter">${e.likes}</span>
        <i class="fas fa-heart likes"></i>
      </div>
    </div>
    </article>
`;
    } else {
      gallery.innerHTML += `
      <article class="card">
      
      <img id="${i++}" class="image" src="/assets/gallery/${e.image}" alt="${
        e.title
      }">
      
      <div class="card-header">
      <h2>${e.title}</h2>
      <div class="card-header-like">
      <span class="counter">${e.likes}</span>
      <i class="fas fa-heart likes"></i>
      </div>
      </div>
      </article>
      
      
      `;
    }
    const img = document.querySelectorAll(".image");
    const movie = document.querySelectorAll(".video");

    img.forEach((img) => {
      img.addEventListener("click", (e) => {
        lightboxImg.innerHTML = `
          <img src="${e.originalTarget.src}" alt="">
          <h2>${e.originalTarget.alt}</h2>
          
          `;
        console.log(e);

        lightbox.style.display = "flex";
      });
    });
    movie.forEach((video) => {
      video.addEventListener("click", (e) => {
        console.log(e.target.attributes.src.nodeValue);
        lightboxImg.innerHTML = `
            <video controls>
            <source src="${e.target.attributes.src.nodeValue}"
            type="video/mp4">
            </video>
            <h2>${e.target.id}</h2>

            
            
            
            `;
        lightbox.style.display = "flex";
      });
    });
  });
}
function onLike(e) {
  const counterLikes = document.querySelectorAll(".likes");
  const counter = document.querySelectorAll(".counter");

  let counterLikeClick = 0;

  counterLikes.forEach((buttonLike) => {
    buttonLike.addEventListener("click", () => {
      if (counterLikeClick == 0) {
        counter.innerHTML = " ";
        counterLikeClick += 1;
      } else {
        counterLikeClick -= 1;
      }
      console.log(counterLikeClick);
    });
  });
}

function displayLikePrice(dataPhoto, mediaPhotographe) {
  let likes = [];
  // Récupearation des likes
  mediaPhotographe.map((e) => {
    likes.push(e.likes);
  });
  // Addition de tous les likes dans une variable totalLikes
  const reducer = (acc, cur) => acc + cur;
  totalLikes = likes.reduce(reducer);

  // Injection du html avec les données du fichier json
  return (likeAndPrice.innerHTML = `
    <div class="likes-price-like">
          <span class="counter">${totalLikes}</span>
          <i class="fas fa-heart black"></i>
    </div>
        <p>${dataPhoto.price}€ / jour</p>
    
    `);
}

function choiceSelect(e) {
  let likes = [];
  // Récupearation des likes
  e.map((e) => {
    likes.push(e.likes);
  });
  likes.sort((a, b) => a - b);
}

filterButton.addEventListener("click", () => {
  filterChoice.style.display = "block";
  filterButton.style.display = "none";
  chevron.classList.remove("fa-chevron-down");
  chevron.classList.add("fa-chevron-up");
});

filterChoice.addEventListener("click", (e) => {
  e.target.innerText;
  console.log(e.currentTarget.dataset);
  filterChoice.style.display = "none";
  filterButton.style.display = "block";
  filterButton.innerText = e.target.innerText;
  chevron.classList.remove("fa-chevron-up");
  chevron.classList.add("fa-chevron-down");
});

// Evenement modal lightbox
lightboxClose.addEventListener("click", () => {
  lightbox.style.display = "none";
});
