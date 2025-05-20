document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        alert('Inicio de sesión exitoso');
        window.location.href = '../ventanasPrincipales/index.html';
        localStorage.setItem("usuarioActual", username);
    } else {
        alert('Nombre de usuario o contraseña incorrectos');
    }
});
