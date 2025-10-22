import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCbkLt5N4TEIg1meWbNP79EjIL_abH50Fg",
  authDomain: "jusscraftz.firebaseapp.com",
  projectId: "jusscraftz",
  storageBucket: "jusscraftz.firebasestorage.app",
  messagingSenderId: "633310849579",
  appId: "1:633310849579:web:d0df608cf928066457586e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ DOM Elements
const userEmailEl = document.getElementById("userEmail");
const userCreatedEl = document.getElementById("userCreated");
const loyaltyPointsEl = document.getElementById("loyaltyPoints");
const totalOrdersEl = document.getElementById("totalOrders");
const ordersContainer = document.getElementById("ordersContainer");
const orderHistorySection = document.getElementById("orderHistory");
const viewOrdersBtn = document.getElementById("viewOrdersBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userEmailEl.textContent = user.email;
  userCreatedEl.textContent = new Date(user.metadata.creationTime).toLocaleDateString();

  // Load loyalty points and orders
  await loadUserOrders(user.uid);
  await loadLoyaltyPoints(user.uid);
});

// ✅ Load orders from Firestore
async function loadUserOrders(uid) {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    let html = "";
    let totalOrders = 0;

    if (querySnapshot.empty) {
      html = "<p>You have no orders yet.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        totalOrders++;
        html += `
          <div class="order-card">
            <p><strong>Order ID:</strong> ${doc.id}</p>
            <p><strong>Status:</strong> ${order.status || "Pending"}</p>
            <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
        `;
      });
    }

    ordersContainer.innerHTML = html;
    totalOrdersEl.textContent = totalOrders;
  } catch (err) {
    console.error("Error loading orders:", err);
    ordersContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

// ✅ Load Loyalty Points (optional feature)
async function loadLoyaltyPoints(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      loyaltyPointsEl.textContent = data.loyaltyPoints || 0;
    }
  } catch (err) {
    console.error("Error loading loyalty points:", err);
  }
}

// ✅ Toggle View Orders
viewOrdersBtn.addEventListener("click", () => {
  const isVisible = orderHistorySection.style.display === "block";
  orderHistorySection.style.display = isVisible ? "none" : "block";
  viewOrdersBtn.textContent = isVisible ? "View Orders" : "Hide Orders";
});

// ✅ Delete Account
deleteAccountBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    // Delete user record from Firestore
    await deleteDoc(doc(db, "users", user.uid));
    // Delete auth account
    await deleteUser(user);
    alert("Account deleted successfully.");
    window.location.href = "register.html";
  } catch (err) {
    console.error("Error deleting account:", err);
    alert("Error deleting account. Please reauthenticate and try again.");
  }
});
