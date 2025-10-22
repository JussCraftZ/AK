// ✅ Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Config
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

// ✅ Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ✅ DOM Elements
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productSize = document.getElementById("productSize");
const productTags = document.getElementById("productTags");
const stockStatus = document.getElementById("stockStatus");
const addToCartBtn = document.getElementById("addToCartBtn");
const notifyBtn = document.getElementById("notifyBtn");
const quantitySelect = document.getElementById("quantity");
const reviewsList = document.getElementById("reviewsList");

// ✅ Load Product Data
async function loadProduct() {
  if (!productId) {
    productName.textContent = "Product not found";
    return;
  }

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    productImage.src = data.image_url || "assets/images/coming-soon.png";
    productName.textContent = data.name;
    productDescription.textContent = data.description;
    productPrice.textContent = `$${data.price.toFixed(2)}`;
    productSize.textContent = `Available Size: ${data.size}`;
    productTags.textContent = `Tags: ${data.tags || "None"}`;

    const inventory = data.inventory || 0;
    stockStatus.textContent = inventory > 0 ? "In Stock" : "Sold Out";

    // ✅ Quantity Options
    quantitySelect.innerHTML = "";
    const maxQty = Math.min(inventory, 12);
    for (let i = 1; i <= maxQty; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      quantitySelect.appendChild(option);
    }

    // ✅ Toggle Buttons
    addToCartBtn.classList.toggle("hidden", inventory === 0);
    notifyBtn.classList.toggle("hidden", inventory > 0);
  } else {
    productName.textContent = "Product not found";
  }
}

// ✅ Load Reviews
async function loadReviews() {
  const reviewsRef = collection(db, "reviews");
  const querySnapshot = await getDocs(reviewsRef);
  reviewsList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const r = doc.data();
    if (r.product_id === productId) {
      const div = document.createElement("div");
      div.classList.add("review");
      div.innerHTML = `
        <p><strong>${r.user_id}</strong></p>
        <p>Rating: ${r.rating} ⭐</p>
        <p>${r.comment}</p>
      `;
      reviewsList.appendChild(div);
    }
  });

  if (reviewsList.innerHTML === "") {
    reviewsList.innerHTML = `<p>No reviews yet. Be the first to share your experience!</p>`;
  }
}

// ✅ Notify Button
notifyBtn.addEventListener("click", () => {
  alert("We'll notify you when this item is restocked!");
});

// ✅ Add to Cart Button
addToCartBtn.addEventListener("click", () => {
  const qty = quantitySelect.value;
  alert(`Added ${qty} × ${productName.textContent} to cart!`);
});

// ✅ Load Everything
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  loadReviews();
});
