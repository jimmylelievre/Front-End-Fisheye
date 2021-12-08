//Mettre le code JavaScript lié à la page photographer.html

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
const header = document.querySelector(".photographe-header");
const gallery = document.querySelector(".media");

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

  displayGallery(mediaPhotographe);
}

function displayGallery(mediaPhotographe) {
  mediaPhotographe.map((e) => {
    if (e.image == undefined) {
      return (gallery.innerHTML += `
    <article class="card">
    <a  href="">
    <video src="/assets/gallery/${e.video}">
    
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

display();
