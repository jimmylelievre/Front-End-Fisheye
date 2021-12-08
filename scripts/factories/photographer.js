function photographerFactory(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;
  const lienPhotographer = ` photographer.html?${id}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    const a = document.createElement("a");
    a.innerHTML = `<img src="assets/photographers/${portrait}"/> <h2>${name}</h2> `;
    a.setAttribute("href", lienPhotographer);

    const h2 = document.createElement("h2");
    h2.textContent = name;
    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`;
    const h4 = document.createElement("h4");
    h4.innerHTML = `${tagline}`;
    const p = document.createElement("p");
    p.innerHTML = `${price}€/jour`;
    article.appendChild(a);
    article.appendChild(h3);
    article.appendChild(h4);
    article.appendChild(p);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
