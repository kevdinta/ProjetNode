let socket = io.connect('http://localhost:2000')
let upload = document.querySelector('#uploadFile')
let form = document.querySelector('#form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let uploadFile = upload.files[0]
  let confirmation = document.querySelector('#confirmation')
  confirmation.innerHTML = '<br><div class="alert alert-success"> Votre fichier a bien été uploadé dans le dossier uploads !</div>'
  socket.emit('uploadJSON', uploadFile)
})
