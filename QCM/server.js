'use strict'

let http = require('http');
let express = require('express');
let io = require('socket.io')();
let app = express();
let fs= require('fs');
let data = fs.readFileSync('public/json/example.json');
let obj = JSON.parse(data);

app.use(express.static(__dirname + '/public'));
const port = 2000

let serveur = http.createServer(app)
io.listen(serveur);

// Connexion socket


app.set('view engine', 'pug')
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', message: 'Acces au QCM'})
})
app.get('/upload', (req, res) => {
  res.render('upload')
})
app.post('/play', (req, res) => {
  res.render('qcm', { title:'QCM', message: 'Ceci est un QCM' })
})

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.status(404).send('Page introuvable')
})
io.sockets.on('connection', (socket) => {
    let adresse = socket.handshake.address
    console.log("Client connecté " + adresse);
    // reception msg Client
    socket.on('message', (message) => {
      console.log(message)
    })
    socket.on('uploadJSON', (file) => {
        fs.writeFile('./uploads/questions.json', file)
    })
    socket.emit('qcm', obj)
})
serveur.listen(port)
