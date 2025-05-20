document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbarNav = document.querySelector(".navbar-nav");

  menuToggle.addEventListener("click", function () {
    navbarNav.classList.toggle("active");
  });

  // Cierra el menú si se hace clic fuera
  document.addEventListener("click", function (e) {
    if (!menuToggle.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove("active");
    }
  });

  // Opcional: Cierra el menú al hacer clic en un enlace
  document.querySelectorAll(".navbar-nav a").forEach(link => {
    link.addEventListener("click", () => {
      navbarNav.classList.remove("active");
    });
  });
});
