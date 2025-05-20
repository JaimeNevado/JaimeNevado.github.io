document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("estadoSesion");
    const usuario = localStorage.getItem("usuarioActual");

    if (contenedor) {
        if (usuario) {
            contenedor.innerHTML = `<a href="../ventanasPrincipales/perfil.html">👤 ${usuario}</a>`;
        } else {
            contenedor.innerHTML = `<a href="../ventanasPrincipales/login.html">🔐 Iniciar Sesión</a>`;
        }
    }

    // Selecciona todos los elementos con id cerrarSesionLink (aunque no es lo ideal tener más de uno con el mismo id)
    const cerrarSesionLinks = document.querySelectorAll("#cerrarSesionLink");

    cerrarSesionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("usuarioActual");
            alert("Sesión cerrada con éxito.");
            window.location.href = "../ventanasPrincipales/login.html";
        });
    });
});
