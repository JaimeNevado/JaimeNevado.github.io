function verificarRespuesta() {
    const seleccion = document.getElementById('seleccion-aeropuerto').value;
    const mensaje = document.getElementById('mensajeResultado');

    if (seleccion === "Málaga") {
        mensaje.textContent = "¡Correcto! Es el Aeropuerto de Málaga. ✈️🎉";
        mensaje.style.color = "#2ecc71";
    } else if (seleccion === "") {
        mensaje.textContent = "Por favor, selecciona un aeropuerto.";
        mensaje.style.color = "#f1c40f";
    } else {
        mensaje.textContent = "❌ Incorrecto. Inténtalo de nuevo.";
        mensaje.style.color = "#e74c3c";
    }
}

window.verificarRespuesta = verificarRespuesta;
