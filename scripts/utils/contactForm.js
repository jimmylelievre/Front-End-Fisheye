const form = document.querySelector('form')
const firstname = document.querySelector('input[name="firstname"]')
const email = document.querySelector('input[name="email"]')
const lastName = document.querySelector('input[name="lastname"]')

const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
const mailRegex = /^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i

const modal = document.getElementById('contact_modal')

function displayModal () {
  const main = document.querySelector('main')
  const header = document.querySelector('header')

  modal.style.display = 'block'
  main.setAttribute('aria-hidden', 'true')
  header.setAttribute('aria-hidden', 'true')
}

function closeModal () {
  const main = document.querySelector('main')
  const modal = document.getElementById('contact_modal')
  const header = document.querySelector('header')

  modal.style.display = 'none'
  main.setAttribute('aria-hidden', 'false')
  header.setAttribute('aria-hidden', 'false')
  modal.setAttribute('aria-hidden', 'false')
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none'
  }
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (emailValid && firstnameValid && lastNameValid) {
    console.log('Formulaire de contact :')

    console.log('prénom :', form.firstname.value)
    console.log('Nom :', form.lastname.value)
    console.log('Email :', form.email.value)
    console.log('Message :', form.message.value)
  } else {
    console.log('pas ok')
  }
})
let firstnameValid = false
firstname.addEventListener('input', (e) => {
  if (validLastName(e)) {
    firstnameValid = true
  } else {
    firstnameValid = false
  }
})
let lastNameValid = false
lastName.addEventListener('input', (e) => {
  if (validFirstname(e)) {
    lastNameValid = true
  } else {
    lastNameValid = false
  }
})

let emailValid = false
email.addEventListener('input', (e) => {
  if (validEmail(e)) {
    emailValid = true
  } else {
    emailValid = false
  }
})

function validEmail (e) {
  if (!e.target.value.match(mailRegex)) {
    console.log('error')

    return false
  } else {
    return true
  }
}

function validFirstname (e) {
  if (!e.target.value.match(nameRegex)) {
    console.log('error')
    firstname.closest('[data-error]').dataset.errorShow = 'true'

    return false
  } else {
    return true
  }
}

function validLastName (e) {
  if (!e.target.value.match(nameRegex)) {
    console.log('error')

    return false
  } else {
    return true
  }
}
