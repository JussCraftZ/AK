// ✅ Firestore Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const productList = document.getElementById("productList");
const sortSelect = document.getElementById("sort");
const filterBtns = document.querySelectorAll(".filter-btn");

// ✅ Load Products
let products = [];

async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    productList.innerHTML = `<p class="error">Error loading products. Please try again later.</p>`;
  }
}

// ✅ Render Products
function renderProducts(productArray) {
  productList.innerHTML = "";

  if (productArray.length === 0) {
    productList.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }

  productArray.forEach((product) => {
    const soldOut = product.inventory === 0;
    const imgSrc = product.image_url || "assets/images/coming-soon.png";

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="${soldOut ? 'sold-out-img' : ''}" />
      <p class="title">${product.name}</p>
      <span class="price">$${product.price.toFixed(2)}</span>
      ${soldOut
        ? `<button class="notify-btn" data-id="${product.id}">Notify Me</button>`
        : `<button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`}
    `;

    productList.appendChild(productCard);
  });

  // Add Notify Listeners
  document.querySelectorAll(".notify-btn").forEach((btn) => {
    btn.addEventListener("click", handleNotify);
  });
}

// ✅ Filter by Category
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-category");
    if (category === "All") {
      renderProducts(products);
    } else {
      const filtered = products.filter((p) => p.category === category);
      renderProducts(filtered);
    }
  });
});

// ✅ Sort Logic
sortSelect.addEventListener("change", () => {
  const value = sortSelect.value;
  let sorted = [...products];

  switch (value) {
    case "low-high":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "high-low":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "best":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "sold-out":
      sorted = sorted.filter((p) => p.inventory === 0);
      break;
  }

  renderProducts(sorted);
});

// ✅ Notify Me Handler
function handleNotify(e) {
  const productId = e.target.getAttribute("data-id");
  alert(`We’ll notify you when this product is back in stock! (Product ID: ${productId})`);
  // Future: Store user email and productId in Firestore under a "restock_notifications" collection
}

// ✅ Load on Page Start
document.addEventListener("DOMContentLoaded", loadProducts);
