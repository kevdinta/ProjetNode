
const form = document.querySelector('#form');

const registerUser = () => {
  const socket = io.connect('localhost:2000');
  const user = {
    firstName : document.querySelector('#prenom').value,
    lastName : document.querySelector('#nom').value,
  };
  window.localStorage.setItem('user', JSON.stringify(user));
}

form.addEventListener('submit', registerUser);
