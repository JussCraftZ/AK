// ✅ Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ DOM Elements
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartShipping = document.getElementById("cartShipping");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ✅ Load Cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Render Cart Items
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty. <a href="products.html">Continue shopping</a></p>`;
    document.querySelector(".cart-summary").style.display = "none";
    return;
  }

  document.querySelector(".cart-summary").style.display = "block";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <label>Quantity:</label>
        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="cart-qty" />
        <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  updateTotals();
}

// ✅ Update Totals
function updateTotals() {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartShipping.textContent = `$${shipping.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ✅ Quantity Change
cartItemsContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("cart-qty")) {
    const index = e.target.dataset.index;
    cart[index].quantity = parseInt(e.target.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// ✅ Remove Item
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// ✅ Checkout Button
checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) return alert("Your cart is empty!");

  // Later this will redirect to checkout/order page
  alert("Proceeding to checkout...");

  // (Optional) Save cart to Firestore for logged-in users
  try {
    await addDoc(collection(db, "orders_temp"), {
      items: cart,
      createdAt: new Date()
    });
  } catch (err) {
    console.error("Error saving cart:", err);
  }
});

// ✅ Load Cart on Page Load
document.addEventListener("DOMContentLoaded", renderCart);
