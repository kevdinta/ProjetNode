'use strict';

const http = require('http');
const express = require('express');
const io = require('socket.io')();
const app = express();
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
io.listen(server);

const questionnaire = JSON.parse(fs.readFileSync('uploads/example.json'));

// Connexion socket
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Accueil',
    message: 'Acces au QCM',
  });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/play', (req, res) => {
  res.render('qcm', {
    title: 'QCM',
    message: 'Ceci est un QCM',
  });
});

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(404).send('Page introuvable');
});

io.sockets.on('connection', (socket) => {
  let adresse = socket.handshake.address;
  console.log('Client connecté ' + adresse);
  // reception msg Client
  socket.on('message', (message) => {
    console.log(message);
  });

  socket.on('uploadJSON', (file) => {
    fs.writeFile(`./uploads/${file.name}`, file);
  });

  socket.on('requestQcm', () => {
    socket.emit('qcm', questionnaire);
  });

  socket.on('saveUserResult', (resultCandidat) => {
    console.log(resultCandidat);
    fs.writeFile(`./results/${resultCandidat.firstName}_${resultCandidat.lastName}_${resultCandidat.date}.json`, JSON.stringify(resultCandidat));
  });

});

const port = 2000;
server.listen(port);
