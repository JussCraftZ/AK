// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// ✅ Extract orderId from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

// ✅ DOM element
const orderInfo = document.getElementById("orderInfo");

async function showOrderDetails() {
  if (!orderId) {
    orderInfo.innerHTML = "<p>No order ID found.</p>";
    return;
  }

  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const order = docSnap.data();

      // ✅ Update status to "Paid"
      await updateDoc(docRef, { status: "Paid" });

      orderInfo.innerHTML = `
        <h2>Order #${orderId}</h2>
        <p><strong>Name:</strong> ${order.customer.name}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <h3>Items:</h3>
        <ul>
          ${order.items
            .map(
              (i) =>
                `<li>${i.name} x${i.quantity} - $${(i.price * i.quantity).toFixed(2)}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total Paid:</strong> $${order.total.toFixed(2)}</p>
      `;

      // ✅ Clear cart
      localStorage.removeItem("cart");
    } else {
      orderInfo.innerHTML = "<p>Order not found in database.</p>";
    }
  } catch (err) {
    console.error("Error fetching order:", err);
    orderInfo.innerHTML = "<p>Error loading order details.</p>";
  }
}

document.addEventListener("DOMContentLoaded", showOrderDetails);
