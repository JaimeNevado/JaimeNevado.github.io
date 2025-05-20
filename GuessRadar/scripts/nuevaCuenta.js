document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const password2 = document.getElementById("password2").value.trim();

        if (!username || !password || !password2) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (password !== password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.some(user => user.username === username);
        if (exists) {
            alert("Ese nombre de usuario ya está registrado.");
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Usuario registrado con éxito.");
        form.reset();

        setTimeout(() => {
            window.location.href = "../ventanasPrincipales/login.html";
        }, 500);
    });
});
