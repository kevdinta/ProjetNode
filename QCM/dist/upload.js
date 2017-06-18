'use strict';

var socket = io.connect('http://localhost:2000');
var upload = document.querySelector('#uploadFile');
var form = document.querySelector('#form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var uploadFile = upload.files[0];
  var confirmation = document.querySelector('#confirmation');
  confirmation.innerHTML = '<br><div class="alert alert-success"> Votre fichier a bien été uploadé dans le dossier uploads !</div>';
  socket.emit('uploadJSON', uploadFile);
});