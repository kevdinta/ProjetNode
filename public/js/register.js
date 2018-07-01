
const registerButton = document.querySelector('#register');

const registerUser = () => {
  const socket = io.connect('localhost:2000');
  const user = {
    firstName : document.querySelector('#prenom').value,
    lastName : document.querySelector('#nom').value,
  };
  console.log(user)
  socket.emit('userRegister', user);
}

registerButton.addEventListener('click', registerUser);
