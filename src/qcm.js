
/* global document, window, io, swal */
'use strict';

const socket = io.connect('http://localhost:2000');
socket.emit('requestQcm');

socket.emit('message', 'J\'ai renseigné mon nom et prénom, je vais pouvoir faire le questionnaire');
const questionBloc = document.querySelector('#question');
const answerBloc = document.querySelector('#answer');
const nextQuestionButton = document.querySelector('#suivant');
let currentQcm = {};
let resultCandidat = {};
let questionNumber = 0;
let questionTimer;

const startQuestionTimer = () => {
  if (currentQcm && currentQcm[questionNumber] && currentQcm[questionNumber].time) {
    let timeleft = currentQcm[questionNumber].time;
    questionTimer = setInterval((timer) => {
      timeleft--;
      document.querySelector('#countdowntimer').innerHTML = timeleft;
      if (timeleft <= 0) {
        clearInterval(questionTimer);
        swal({
          title: 'Temps écoulé',
          text: 'On passe a la question suivante',
          type: 'error',
          confirmButtonText: 'Ok',
        }).then((res) => {
          console.log('ok');
          nextQuestion();
        });
      }
    }, 1000);
  }
};


const writeQuestion = () => {
  startQuestionTimer();
  questionBloc.innerHTML = currentQcm[questionNumber].question;

  switch (currentQcm[questionNumber].type) {
    case ('choice'):
      const writeRadioAnswer = (element, index, array) => {
        let radio = document.createElement('INPUT');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('value', element);
        radio.setAttribute('name', 'nom');
        let txt = document.createTextNode(element);
        answerBloc.appendChild(radio);
        answerBloc.appendChild(txt);
      };
      currentQcm[questionNumber].choices.forEach(writeRadioAnswer);
      break;
    case ('free'):
      let inputT = document.createElement('INPUT');
      inputT.setAttribute('type', 'text');
      inputT.setAttribute('id', 'repText');
      answerBloc.appendChild(inputT);
      break;
  }
};


const checkAnswer = () => {
  const resultQuestion = {
    question: currentQcm.question,
    success: false,
    answer: '',
  };
  resultQuestion.question = currentQcm[questionNumber].question;
  switch (currentQcm[questionNumber].type) {
    // Pour les question a choix multiple
    case 'choice':
      for (let i = 0; i < answerBloc.childElementCount; i++) {
        if (answerBloc.children[i].checked === true) {
          resultQuestion.answer = answerBloc.children[i].value;
          for (let k = 0; k < currentQcm[questionNumber].responses.length; k++) {
            if ((answerBloc.children[i].value) === currentQcm[questionNumber].responses[k]) {
              resultQuestion.success = true;
            }
          }
        }
      }
      break;

    case 'free':
      for (let k = 0; k < currentQcm[questionNumber].responses.length; k++) {
        if (document.querySelector('#repText').value.toUpperCase()
        === currentQcm[questionNumber].responses[k].toUpperCase()) {
          resultQuestion.success = true;
        }
      }
      resultQuestion.answer = document.querySelector('#repText').value;
      break;
  }
  return resultQuestion;
};

const nextQuestion = () => {
  clearInterval(questionTimer);
  resultCandidat.answers.push(checkAnswer());
  while (answerBloc.firstChild) {
    answerBloc.removeChild(answerBloc.firstChild);
  }
  if (questionNumber + 1 >= currentQcm.length) {
    document.querySelector('#countdowntimer').style.display = 'none';
    nextQuestionButton.value = 'Terminé';
    questionBloc.innerHTML = "C'est fini";
    const success = resultCandidat.answers.filter(x => x.success === true).length;
    resultCandidat.score = success / currentQcm.length * 100;
    socket.emit('saveUserResult', resultCandidat);
    swal({
      title: 'QCM terminé',
      text: `Votre score est ${resultCandidat.score} %`,
      type: 'success',
      confirmButtonText: 'Cool!',
    });
  } else {
    // alert(JSON.stringify(resultCandidat, null, 2));
    questionNumber++;
    writeQuestion();
  }
};


socket.on('qcm', (qcm) => {
  currentQcm = qcm;
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (user) {
    var d = new Date();
    const dateString = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}@${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    resultCandidat = {
      firstName: user.firstName,
      lastName: user.lastName,
      date: dateString,
      score: 0,
      answers: [],
    };

    writeQuestion();
    nextQuestionButton.addEventListener('click', nextQuestion);
  } else {
    swal({
      title: 'Oops',
      text: 'Un erreur est survenu, veuillez reessayer',
      type: 'error',
      confirmButtonText: 'Ok',
    }).then((res) => {
      window.location.href = '/';
    });
  }

});
