let tab = [];
let htag = [
  "Portrait",
  "Art",
  "Fashion",
  "Architecture",
  "Travel",
  "Sport",
  "Animals",
  "Events",
];

// Récupération des données json
const fetchPhotographe = async () => {
  await fetch("data/photographers.json")
    .then((res) => res.json())
    .then((data) => {
      tab = data.photographers;
    });
};

async function getPhotographers() {
  await fetchPhotographe();
  const photographers = tab;
  return {
    photographers: [...photographers],
  };
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
