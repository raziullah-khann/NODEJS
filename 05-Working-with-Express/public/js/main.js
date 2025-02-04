document.addEventListener("DOMContentLoaded", function () {
  const backdrop = document.querySelector(".backdrop");
  const sideDrawer = document.querySelector(".mobile-nav");
  const menuToggle = document.querySelector("#side-menu-toggle");

  if (!menuToggle) {
    console.error("Hamburger menu button not found in the DOM.");
    return;
  }

  function openMenu() {
    backdrop.style.display = "block";
    sideDrawer.classList.add("open");
  }

  function closeMenu() {
    backdrop.style.display = "none";
    sideDrawer.classList.remove("open");
  }

  menuToggle.addEventListener("click", openMenu);
  backdrop.addEventListener("click", closeMenu);
});
