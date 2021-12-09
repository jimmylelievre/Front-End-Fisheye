//Dom
const header = document.querySelector(".photographe-header");
const gallery = document.querySelector(".media");
const likeAndPrice = document.querySelector(".likes-price");

// Recuperation de la chaine de caractere dan sl'url
const urlId = window.location.search;

console.log(urlId);

// Extraction de l'id
const id = urlId.slice(1);
console.log(id);

// Récupération des données json

const fetchPhotographe = async () => {
  await fetch("data/photographers.json")
    .then((res) => res.json())
    .then((data) => {
      // trouver l'id de data egale a l'id de l'url
      dataPhotographe = data.photographers.find((e) => e.id == id);
      mediaPhotographe = data.media.filter((e) => e.photographerId == id);
      console.log(mediaPhotographe);
    });
};

async function display() {
  await fetchPhotographe();
  dataPhotographe;
  mediaPhotographe;
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
}

function displayGallery(mediaPhotographe) {
  const regex = /_/gi;
  mediaPhotographe.map((e) => {
    if (e.image == undefined) {
      return (gallery.innerHTML += `
    <article class="card">
    <a  href="">
      <i class="fas fa-play"></i>
      <video src="/assets/gallery/${e.video}">
    </a>
    <div class="card-header">
      <h2>${e.video.replace(".mp4", " ").replace(regex, " ")}</h2>
      <div class="card-header-like">
        <span class="counter">${e.likes}</span>
        <i class="fas fa-heart"></i>
      </div>
    </div>
    </article>


`);
    }

    return (gallery.innerHTML += `
    <article class="card">
    <a  href="">
    <img src="/assets/gallery/${e.image}" alt="">
    </a>
    <div class="card-header">
      <h2>${e.title}</h2>
      <div class="card-header-like">
        <span class="counter">${e.likes}</span>
        <i class="fas fa-heart"></i>
      </div>
    </div>
    </article>


`);
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

display();
