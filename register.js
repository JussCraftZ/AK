import { registerUser } from './lib_auth.js';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const agreed = document.getElementById('agree').checked;

  try {
    await registerUser(email, password, agreed);
    alert('Account created successfully! Welcome to JussCraftZ!');
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});
