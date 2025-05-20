let tiempoRestante = 20;
let temporizador;
let juegoTerminado = false;

const tiempoElemento = document.getElementById('tiempo');
const barraTemporizador = document.getElementById('barra-temporizador');
const botones = document.querySelectorAll('.opciones button');
const resultado = document.getElementById('result');

function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tiempoRestante--;
        tiempoElemento.textContent = tiempoRestante;

        const porcentajeRestante = (tiempoRestante / 20) * 100;
        barraTemporizador.style.setProperty('width', `${porcentajeRestante}%`);

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            terminarJuego(false);
        }
    }, 1000);
}

function terminarJuego(ganaste) {
    if (juegoTerminado) return;
    juegoTerminado = true;

    botones.forEach(boton => boton.disabled = true);

    if (!ganaste) {
        resultado.textContent = "¡Tiempo agotado! Has perdido.";
        resultado.style.color = "red";
    }
}

function checkAnswer(button) {
    clearInterval(temporizador);
    const correcto = button.getAttribute('data-correct') === 'true';

    if (correcto) {
        resultado.textContent = "¡Correcto! 🎉";
        resultado.style.color = "green";
    } else {
        resultado.textContent = "Incorrecto 😢";
        resultado.style.color = "red";
    }

    botones.forEach(boton => boton.disabled = true);
    juegoTerminado = true;
}

window.onload = iniciarTemporizador;
