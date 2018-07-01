const socket = io.connect('http://localhost:2000')
const upload = document.querySelector('#uploadFile')
const form = document.querySelector('#form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let uploadFile = upload.files[0]
  console.log(upload.files)
  socket.emit('uploadJSON', uploadFile)
  swal({
    title: 'Nice !',
    text: 'Votre QCM à été uploader avec succès',
    type: 'success',
    confirmButtonText: 'Cool!'
  });    
})
