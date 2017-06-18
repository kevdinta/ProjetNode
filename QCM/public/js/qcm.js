let socket = io.connect('http://localhost:2000');
socket.emit('message', 'J\'ai renseigné mon nom et prénom, je vais pouvoir faire le QCM')
let bloc = document.querySelector('#questions')
let suivant = document.querySelector("#suivant")
socket.on('qcm', (obj) => {
  let question = obj.question
  let choices = obj.choices
  let chiffre = 0
  let timeleft
  let questionTimer
  let date = new Date()
  let success = 0
  let note
  let radios = bloc.children
  let resultCandidat = "{\n \"name\" : \" "
      resultCandidat+= ""
      resultCandidat+="\"\n"
      resultCandidat+="\"date\" : \""
      resultCandidat+= date
      resultCandidat+= "\"\n"
      resultCandidat+="\"score\" : \" "
      resultCandidat+= note
      resultCandidat+="\"\n"
      resultCandidat+="\"responses\" : ["

  let resultQuestion = ""
  let reponseIsTrue = false


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
              inputT.setAttribute('id', 'repText')
              bloc.appendChild(inputT)
    }
  }



  function checkAnswer(){
    // Pour les question a choix multiple
    if(obj[chiffre].type == 'choice')
    {
      for(let i=0; i<bloc.childElementCount; i++)
      {
         if (bloc.children[i].checked == true)
           {
             //alert(obj[chiffre].responses.length)
             for (let k=0; k<obj[chiffre].responses.length; k++)
             {
               if ((bloc.children[i].value ) == obj[chiffre].responses[k])
               {
                 reponseIsTrue= true
                 success++
               }
             }


             resultQuestion += "\n{\n\t\"question\" : \"  "
             resultQuestion += obj[chiffre].question
             resultQuestion+= "\" "+
                              "\n\t\"success\" : "
             resultQuestion+= reponseIsTrue
             resultQuestion+="\n\t\"responses\" : [\n\t\t"

             resultQuestion += bloc.children[i].value
             resultQuestion += "\n\t ] \n}"
           }
      }
    }
    // Pour les question free
    if(obj[chiffre].type == 'free')
    {

      for (let k=0; k<obj[chiffre].responses.length; k++)
      {
        if ((document.querySelector("#repText").value ) == obj[chiffre].responses[k])
        {
          reponseIsTrue= true
          success++
        }
      }

      resultQuestion += "\n{\n\t\"question\" : \"  "
      resultQuestion += obj[chiffre].question
      resultQuestion+= "\" "+
                       "\n\t\"success\" : "
      resultQuestion+= reponseIsTrue
      resultQuestion+="\n\t\"responses\" : [\n\t\t"

      resultQuestion += document.querySelector("#repText").value
      resultQuestion += "\n\t ] \n}\n\n"
    }
  }

  function questionSuivante(){

    checkAnswer();
    if (chiffre +1  >= obj.length ){
      document.querySelector("#countdowntimer").style.display = "none"
      suivant.value = "Terminé"
      bloc.innerHTML = "C'est fini"
      note = success / obj.length * 100
      alert('Votre note est ' + note + '%')
    }
    resultCandidat += resultQuestion
    socket.emit('resultCandidat', resultCandidat)
    alert(resultCandidat)
    clearInterval(questionTimer)
    chiffre++
    writeQuestion()
  }
  writeQuestion()
  suivant.addEventListener('click',questionSuivante)
})
