import { auth, db } from "../../src/lib/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  setDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Register
async function registerUser(e) {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const name = document.getElementById("registerName").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      joinedAt: serverTimestamp(),
      loyalty_points: 0,
    });
    alert("Registration successful!");
    window.location.href = "account.html";
  } catch (err) {
    alert(err.message);
  }
}

// Login
async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
    window.location.href = "account.html";
  } catch (err) {
    alert(err.message);
  }
}

// Logout
async function logoutUser() {
  await signOut(auth);
  alert("You’ve logged out!");
  window.location.href = "index.html";
}

// Listen for auth state
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
