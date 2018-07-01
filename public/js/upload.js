/* global document, io, swal */

'use strict';

var socket = io.connect('http://localhost:2000');
var upload = document.querySelector('#uploadFile');
var form = document.querySelector('#form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var uploadFile = upload.files[0];
  console.log(upload.files);
  socket.emit('uploadJSON', uploadFile);
  swal({
    title: 'Nice !',
    text: 'Votre QCM à été uploader avec succès',
    type: 'success',
    confirmButtonText: 'Cool!'
  });
});