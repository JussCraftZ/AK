// ✅ assets/js/loadNavbar.js

// Function to load HTML components (Navbar + Footer)
async function loadComponent(id, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

// ✅ Load Navbar and Footer when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create containers for navbar & footer if not present
  if (!document.getElementById("navbar")) {
    const nav = document.createElement("div");
    nav.id = "navbar";
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (!document.getElementById("footer")) {
    const foot = document.createElement("div");
    foot.id = "footer";
    document.body.appendChild(foot);
  }

  // Load components
  loadComponent("navbar", "assets/components/navbar.html");
  loadComponent("footer", "assets/components/footer.html");
});
