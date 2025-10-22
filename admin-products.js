import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
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

const addProductForm = document.getElementById("addProductForm");
const productsContainer = document.getElementById("productsContainer");

// ✅ Restrict access to admin users only
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const adminEmails = ["youradminemail@example.com"]; // ← change this to your admin email(s)
  if (!adminEmails.includes(user.email)) {
    alert("⛔ Access denied. Admins only.");
    window.location.href = "index.html";
    return;
  }

  loadProducts();
});

// ✅ Load Products from Firestore
async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    if (snapshot.empty) {
      productsContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    let html = "";
    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      html += `
        <div class="product-card-admin">
          <img src="${product.image}" alt="${product.name}" />
          <div class="info">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p>${product.category}</p>
            <div class="admin-actions">
              <button class="btn-edit" data-id="${docSnap.id}">Edit</button>
              <button class="btn-delete" data-id="${docSnap.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
    });

    productsContainer.innerHTML = html;

    document.querySelectorAll(".btn-delete").forEach((btn) =>
      btn.addEventListener("click", deleteProduct)
    );
    document.querySelectorAll(".btn-edit").forEach((btn) =>
      btn.addEventListener("click", editProduct)
    );
  } catch (err) {
    console.error("Error loading products:", err);
    productsContainer.innerHTML = "<p>Error loading products.</p>";
  }
}

// ✅ Add New Product
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const category = document.getElementById("category").value.trim();
  const image = document.getElementById("image").value.trim();
  const stock = parseInt(document.getElementById("stock").value);

if (!name || !price || !category || !image || isNaN(stock)) 
  return alert("Please fill in all fields.");

try {
  await addDoc(collection(db, "products"), {
    name,
    description,
    price,
    category,
    image,
    stock, // ✅ use value from input instead of hardcoded 10
    createdAt: new Date().toISOString(),
  });

  alert("✅ Product added successfully!");
  addProductForm.reset();
  loadProducts();
} catch (err) {
  console.error("Error adding product:", err);
  alert("Error adding product.");
}
});

// ✅ Edit Product
async function editProduct(e) {
  const id = e.target.dataset.id;
  const newName = prompt("Enter new name:");
  const newPrice = parseFloat(prompt("Enter new price:"));
  const newCategory = prompt("Enter new category:");
  const newImage = prompt("Enter new image URL:");

  if (!newName || !newPrice || !newCategory || !newImage) return;

  try {
    await updateDoc(doc(db, "products", id), {
      name: newName,
      price: newPrice,
      category: newCategory,
      image: newImage,
    });
    alert("✅ Product updated!");
    loadProducts();
  } catch (err) {
    console.error("Error updating product:", err);
  }
}

// ✅ Delete Product
async function deleteProduct(e) {
  const id = e.target.dataset.id;
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await deleteDoc(doc(db, "products", id));
    alert("🗑️ Product deleted.");
    loadProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
  }
}
