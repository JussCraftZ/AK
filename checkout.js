// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Stripe Import
const stripe = Stripe("pk_live_51SHtwWRqiLVzbMk6Lfc9eVNb67tWSitFrmBLS6Wzk2jk7GtqNhNW2OxtePAlHLUddRY2QHVrmmFrV1qNmPhoLraI00PVagwhna");

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

// ✅ Stripe Config
const stripePublicKey = "YOUR_STRIPE_PUBLISHABLE_KEY";
const stripe = Stripe(stripePublicKey);

// ✅ Load Cart
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ DOM Elements
const orderSummary = document.getElementById("orderSummary");
const subtotalEl = document.getElementById("checkoutSubtotal");
const shippingEl = document.getElementById("checkoutShipping");
const totalEl = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

// ✅ Render Order Summary
function renderSummary() {
  orderSummary.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("summary-item");
    div.innerHTML = `
      <p>${item.name} x${item.quantity}</p>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderSummary.appendChild(div);
  });

  const shipping = cart.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

renderSummary();

// ✅ Handle Checkout
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) return alert("Your cart is empty.");

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const country = document.getElementById("country").value;

  const orderData = {
    items: cart,
    customer: {
      name: fullName,
      email,
      address,
      city,
      state,
      zip,
      country
    },
    subtotal: parseFloat(subtotalEl.textContent.replace("$", "")),
    shipping: parseFloat(shippingEl.textContent.replace("$", "")),
    total: parseFloat(totalEl.textContent.replace("$", "")),
    created_at: serverTimestamp(),
    status: "Pending Payment"
  };

  try {
    // ✅ Store Order in Firestore
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Order added with ID:", docRef.id);

    // ✅ Proceed to Stripe Checkout
    const session = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
  items: cart, 
  orderId: docRef.id,
  email: email // from the checkout form
})

    }).then(res => res.json());

    if (session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      alert("Failed to start payment session.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong, please try again.");
  }
});
