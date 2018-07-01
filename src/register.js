
/* global document, window */

'use strict';

const form = document.querySelector('#form');

const registerUser = () => {
  const user = {
    firstName: document.querySelector('#prenom').value,
    lastName: document.querySelector('#nom').value,
  };
  window.localStorage.setItem('user', JSON.stringify(user));
};

form.addEventListener('submit', registerUser);
