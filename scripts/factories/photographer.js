function photographerFactory (data) {
  const { name, portrait, city, country, tagline, price, id } = data

  const picture = `assets/photographers/${portrait}`
  const lienPhotographer = ` photographer.html?${id}`

  function getUserCardDOM () {
    const article = document.createElement('article')
    article.setAttribute('tabindex', 0)

    const a = document.createElement('a')
    a.innerHTML = `<img   aria-label="portrait de ${name}" src="assets/photographers/${portrait}"/><h2 aria-label="Le nom du photographe est ${name}"  >${name}</h2> `
    a.setAttribute('href', lienPhotographer)

    const h3 = document.createElement('h3')
    h3.textContent = `${city}, ${country}`
    h3.setAttribute('tabindex', 0)

    h3.setAttribute('aria-label', `La ville du photographe est ${city} en ${country} `)

    const h4 = document.createElement('h4')
    h4.innerHTML = `${tagline}`
    h4.setAttribute('tabindex', 0)
    h4.setAttribute('aria-label', `Le slogan du photographe est ${tagline}`)

    const p = document.createElement('p')
    p.innerHTML = `${price}€/jour`
    p.setAttribute('tabindex', 0)
    p.setAttribute('aria-label', `Le tarif du photographe est de ${price}€ par jour`)

    article.appendChild(a)
    article.appendChild(h3)
    article.appendChild(h4)
    article.appendChild(p)

    return article
  }
  return { name, picture, getUserCardDOM }
}
