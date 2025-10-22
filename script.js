// ✅ Load Navbar & Footer dynamically on every page
document.addEventListener("DOMContentLoaded", async () => {
  // Load Navbar
  try {
    const navRes = await fetch("assets/components/navbar.html");
    const navHTML = await navRes.text();
    const navContainer = document.createElement("div");
    navContainer.innerHTML = navHTML;
    document.body.insertBefore(navContainer, document.body.firstChild);
  } catch (err) {
    console.error("Error loading Navbar:", err);
  }

  // Load Footer
  try {
    const footRes = await fetch("assets/components/footer.html");
    const footHTML = await footRes.text();
    const footContainer = document.createElement("div");
    footContainer.innerHTML = footHTML;
    document.body.appendChild(footContainer);
  } catch (err) {
    console.error("Error loading Footer:", err);
  }

  // Wait a moment to ensure navbar/footer are loaded before initializing
  setTimeout(initPageScripts, 300);
});

function initPageScripts() {
  // ✅ MOBILE MENU TOGGLE
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // ✅ AUTO YEAR IN FOOTER
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ✅ CART COUNT (syncs with localStorage)
  const cartCountEl = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartCountEl) cartCountEl.textContent = cart.length;

  // ✅ Close mobile menu when clicking a link
  const mobileLinks = document.querySelectorAll("#mobileMenu a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

// ✅ Function to update cart count when items are added
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

// Make updateCartCount available globally
window.updateCartCount = updateCartCount;
