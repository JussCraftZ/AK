import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const ordersContainer = document.getElementById("ordersContainer");

// ✅ Only allow admin access
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const adminEmails = ["youradminemail@example.com"]; // ← replace with your admin email(s)
  if (!adminEmails.includes(user.email)) {
    ordersContainer.innerHTML = "<p>⛔ Access denied. Admins only.</p>";
    return;
  }

  await loadAllOrders();
});

// ✅ Load all orders from Firestore
async function loadAllOrders() {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    if (snapshot.empty) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    let html = "";
    snapshot.forEach((docSnap) => {
      const order = docSnap.data();
      html += `
        <div class="order-card">
          <h3>Order ID: ${docSnap.id}</h3>
          <p><strong>User ID:</strong> ${order.userId}</p>
          <p><strong>Status:</strong> 
            <select data-id="${docSnap.id}" class="statusSelect">
              <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
              <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
              <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
              <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
              <option value="Canceled" ${order.status === "Canceled" ? "selected" : ""}>Canceled</option>
            </select>
          </p>
          <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <button class="deleteBtn" data-id="${docSnap.id}">🗑 Delete</button>
        </div>
      `;
    });

    ordersContainer.innerHTML = html;

    // Attach event listeners for updates and deletes
    document.querySelectorAll(".statusSelect").forEach((select) =>
      select.addEventListener("change", updateOrderStatus)
    );
    document.querySelectorAll(".deleteBtn").forEach((btn) =>
      btn.addEventListener("click", deleteOrder)
    );
  } catch (err) {
    console.error("Error loading orders:", err);
    ordersContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

// ✅ Update Order Status
async function updateOrderStatus(e) {
  const id = e.target.dataset.id;
  const newStatus = e.target.value;

  try {
    await updateDoc(doc(db, "orders", id), { status: newStatus });
    alert(`Order ${id} status updated to ${newStatus}.`);
  } catch (err) {
    console.error("Error updating status:", err);
  }
}

// ✅ Delete an order
async function deleteOrder(e) {
  const id = e.target.dataset.id;
  if (!confirm("Are you sure you want to delete this order?")) return;

  try {
    await deleteDoc(doc(db, "orders", id));
    alert("Order deleted.");
    e.target.parentElement.remove();
  } catch (err) {
    console.error("Error deleting order:", err);
  }
}
