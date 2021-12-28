
function displayModal () {
  const modal = document.getElementById('contact_modal')
  modal.style.display = 'block'
}

function closeModal () {
  const modal = document.getElementById('contact_modal')
  modal.style.display = 'none'
}

const form = document.querySelector('form')
const firstname = document.querySelector('input[name="firstname"]')
console.log(firstname)

form.addEventListener('click', (e) => {
  e.preventDefault()
  console.log('Formulaire de contact :')

  console.log('prénom :', form.firstname.value)
  console.log('Nom :', form.lastname.value)
  console.log('Email :', form.email.value)
  console.log('Message :', form.message.value)
})
