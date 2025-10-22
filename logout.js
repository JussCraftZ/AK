import { logoutUser, getCurrentUser } from '../../lib_auth.js';

window.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.getElementById('login-link');

  const user = await getCurrentUser();
  if (user) {
    logoutBtn.style.display = 'inline-block';
    loginLink.style.display = 'none';
  }

  logoutBtn.addEventListener('click', async () => {
    await logoutUser();
    alert('You have been logged out.');
    window.location.href = 'index.html';
  });
});
