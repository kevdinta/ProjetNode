
/* global document, window */

'use strict';

var form = document.querySelector('#form');

var registerUser = function registerUser() {
  var user = {
    firstName: document.querySelector('#prenom').value,
    lastName: document.querySelector('#nom').value
  };
  window.localStorage.setItem('user', JSON.stringify(user));
};

form.addEventListener('submit', registerUser);