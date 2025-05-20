let answered = false;

function checkAnswer(button) {
    if (answered) return;
    answered = true;

    const esCorrecta = button.getAttribute("data-correct") === "true";
    const resultado = document.getElementById("result");

    if (esCorrecta) {
        button.classList.add("correct");
        resultado.textContent = "¡Correcto! Es un Boeing 777.";
    } else {
        button.classList.add("wrong");
        resultado.textContent = "Incorrecto. El modelo correcto es: Boeing 777.";

        const botones = document.querySelectorAll(".opciones button");
        botones.forEach(btn => {
            if (btn.getAttribute("data-correct") === "true") {
                btn.classList.add("correct");
            }
        });
    }
}
