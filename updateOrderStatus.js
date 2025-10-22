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

async function updateOrderStatus() {
  if (!orderId) {
    console.warn("⚠️ No order ID found in URL.");
    return;
  }

  try {
    const orderRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      await updateDoc(orderRef, { status: "Paid" });
      console.log(`✅ Order ${orderId} marked as Paid.`);

      // ✅ Clear cart after payment success
      localStorage.removeItem("cart");

      // ✅ Update page content for the user
      document.body.innerHTML = `
        <div id="navbar-container"></div>
        <main class="success-page">
          <h1>✅ Payment Successful!</h1>
          <p>Thank you for your order. Your payment has been confirmed.</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <a href="orders.html" class="btn-primary">View My Orders</a>
          <a href="shop.html" class="btn-secondary">Continue Shopping</a>
        </main>
        <div id="footer-container"></div>
      `;

      // Re-load Navbar and Footer (optional but nice)
      const navScript = document.createElement("script");
      navScript.src = "assets/js/loadNavbar.js";
      document.body.appendChild(navScript);

      const footerScript = document.createElement("script");
      footerScript.src = "assets/js/loadFooter.js";
      document.body.appendChild(footerScript);

    } else {
      console.warn(`⚠️ No order found with ID ${orderId}`);
      document.body.innerHTML = `
        <main class="error-page">
          <h1>⚠️ Order Not Found</h1>
          <p>We couldn’t find your order. Please contact support.</p>
          <a href="shop.html" class="btn-secondary">Return to Shop</a>
        </main>
      `;
    }

  } catch (err) {
    console.error("Error updating order:", err);
    document.body.innerHTML = `
      <main class="error-page">
        <h1>❌ Error Processing Payment</h1>
        <p>Something went wrong while confirming your payment. Please try again later.</p>
        <a href="shop.html" class="btn-secondary">Return to Shop</a>
      </main>
    `;
  }
}

// ✅ Run on page load
document.addEventListener("DOMContentLoaded", updateOrderStatus);
