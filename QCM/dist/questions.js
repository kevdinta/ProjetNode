'use strict';

var socket = io.connect('http://localhost:2000');
socket.emit('message', 'J\'ai renseigné mon nom et prénom, je vais pouvoir faire le QCM');
var bloc = document.querySelector('#questions');
socket.on('qcm', function (obj) {
  var question = obj.question;
  var choices = obj.choices;
  var chiffre = 0;
  var timeleft = void 0;
  var questionTimer = void 0;
  function timerQuestion() {

    timeleft = obj[chiffre].time;
    questionTimer = setInterval(function (timer) {
      timeleft--;
      document.querySelector("#countdowntimer").innerHTML = timeleft;
      if (timeleft <= 0) {
        clearInterval(questionTimer);
        alert("Temps ecoulé !\n On passe à la question suivant");
        questionSuivante();
      }
    }, 1000);
  }
  function writeQuestion() {

    timerQuestion();
    bloc.innerHTML = obj[chiffre].question;
    if (obj[chiffre].type == 'choice') {
      var logArrayElements = function logArrayElements(element, index, array) {
        var radio = document.createElement('INPUT');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('value', element);
        radio.setAttribute('name', 'nom');
        radio.setAttribute('id', 'id');
        radio.setAttribute('checked', 'false');
        var txt = document.createTextNode(element);
        bloc.appendChild(radio);
        bloc.appendChild(txt);
      };

      obj[chiffre].choices.forEach(logArrayElements);
    }

    if (obj[chiffre].type == 'free') {
      var inputT = document.createElement('INPUT');
      inputT.setAttribute('type', 'text');
      bloc.appendChild(inputT);
    }
  }

  function questionSuivante() {
    clearInterval(questionTimer);
    chiffre++;
    writeQuestion();
  }

  writeQuestion();

  var suivant = document.querySelector('#suivant');
  suivant.addEventListener('click', questionSuivante);
});