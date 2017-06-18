let socket = io.connect('http://localhost:2000');
socket.emit('message', 'J\'ai renseigné mon nom et prénom, je vais pouvoir faire le QCM')
let bloc = document.querySelector('#questions')
socket.on('qcm', (obj) => {
  let question = obj.question
  let choices = obj.choices
  let chiffre = 0
  let timeleft
  let questionTimer
  function timerQuestion() {

    timeleft  = obj[chiffre].time
    questionTimer = setInterval((timer) => {
    timeleft--
    document.querySelector("#countdowntimer").innerHTML = timeleft
    if(timeleft <= 0)
      {
        clearInterval(questionTimer)
        alert("Temps ecoulé !\n On passe à la question suivant")
        questionSuivante()
      }
    },1000);
  }
  function writeQuestion() {

    timerQuestion()
    bloc.innerHTML = obj[chiffre].question
    if(obj[chiffre].type == 'choice')
    {
        function logArrayElements(element, index, array) {
          let radio = document.createElement('INPUT')
          radio.setAttribute('type', 'radio')
          radio.setAttribute('value', element)
          radio.setAttribute('name', 'nom')
          radio.setAttribute('id', 'id')
          radio.setAttribute('checked', 'false')
          let txt = document.createTextNode(element)
          bloc.appendChild(radio)
          bloc.appendChild(txt)
        }
        obj[chiffre].choices.forEach(logArrayElements);
    }

    if(obj[chiffre].type == 'free')
    {
      let inputT = document.createElement('INPUT')
              inputT.setAttribute('type', 'text')
              bloc.appendChild(inputT)
    }
  }

  function questionSuivante(){
    clearInterval(questionTimer)
    chiffre++
    writeQuestion()
  }

  writeQuestion()

  let suivant = document.querySelector('#suivant')
  suivant.addEventListener('click',questionSuivante)
})
