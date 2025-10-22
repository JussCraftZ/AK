import { loginUser } from './lib_auth.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    await loginUser(email, password);
    alert('Login successful! Redirecting...');
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
  }
});
