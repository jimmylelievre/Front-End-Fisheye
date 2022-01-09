function photographerFactory (data) {
  const { name, portrait, city, country, tagline, price, id } = data

  const picture = `assets/photographers/${portrait}`
  const lienPhotographer = ` photographer.html?${id}`

  function getUserCardDOM () {
    const article = document.createElement('article')

    const a = document.createElement('a')
    a.innerHTML = `<img tabindex='1' src="assets/photographers/${portrait}"/> <h2 tabindex='1' >${name}</h2> `
    a.setAttribute('href', lienPhotographer)

    const h3 = document.createElement('h3')
    h3.textContent = `${city}, ${country}`
    h3.setAttribute('tabindex', 1)

    const h4 = document.createElement('h4')
    h4.innerHTML = `${tagline}`
    h4.setAttribute('tabindex', 1)

    const p = document.createElement('p')
    p.innerHTML = `${price}€/jour`
    p.setAttribute('tabindex', 1)

    article.appendChild(a)

    article.appendChild(h3)
    article.appendChild(h4)
    article.appendChild(p)

    return article
  }
  return { name, picture, getUserCardDOM }
}
