// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// ✅ Elements
const shopContainer = document.getElementById("shopContainer");

// ✅ Load Products
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  if (snapshot.empty) {
    shopContainer.innerHTML = "<p>No products available.</p>";
    return;
  }

  let html = "";
  snapshot.forEach((docSnap) => {
    const product = { id: docSnap.id, ...docSnap.data() };
    html += `
      <div class="product-card ${product.stock <= 0 ? 'sold-out' : ''}">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        ${product.stock > 0 
          ? `<button class="btn-add" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>`
          : `<span class="sold-out-label">Sold Out</span>`}
      </div>
    `;
  });

  shopContainer.innerHTML = html;

  // ✅ Add to Cart Events
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
        quantity: 1,
      });
    });
  });
}

// ✅ Add to Cart Logic
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((i) => i.id === item.id);
  if (existing) existing.quantity += 1;
  else cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`🛒 Added ${item.name} to cart!`);
}

loadProducts();
