let conexiones = [];

document.querySelectorAll('.draggable').forEach(img => {
    img.addEventListener('dragstart', e => {
        e.dataTransfer.setData("text/plain", img.id);
    });
});

document.querySelectorAll('.droppable').forEach(drop => {
    drop.addEventListener('dragover', e => {
        e.preventDefault();
        drop.style.borderColor = "#2ecc71";
    });

    drop.addEventListener('dragleave', () => {
        drop.style.borderColor = "#00f0ff";
    });

    drop.addEventListener('drop', e => {
        e.preventDefault();
        drop.style.borderColor = "#00f0ff";

        const avionId = e.dataTransfer.getData("text/plain");
        const img = document.getElementById(avionId);

        if (!drop.classList.contains("filled")) {
            drop.classList.add("filled");
            drop.setAttribute("data-img", avionId);

            const linea = new LeaderLine(
                LeaderLine.pointAnchor(img, { x: '100%', y: '50%' }),
                LeaderLine.pointAnchor(drop, { x: '0%', y: '50%' }),
                { color: '#00f0ff', size: 3 }
            );

            conexiones.push({ img, drop, linea });
        }
    });
});


function reintentar() {
    conexiones.forEach(({ linea }) => linea.remove());
    conexiones = [];

    document.querySelectorAll('.droppable').forEach(drop => {
        drop.classList.remove('filled', 'correct', 'wrong');
        drop.removeAttribute('data-img');
        drop.style.borderColor = "#00f0ff";
        drop.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        drop.style.color = "white";
        drop.textContent = drop.getAttribute("data-name"); // si usas texto en el drop
    });

    const imagenesContainer = document.querySelector('.imagenes');
    conexiones.forEach(({ img }) => {
        imagenesContainer.appendChild(img);
    });

    const resultado = document.getElementById("resultado");
    if (resultado) resultado.textContent = "";
}



function verificar() {
    let correctas = 0;

    conexiones.forEach(pair => {
        const avion = pair.img.id;
        const nombre = pair.drop.getAttribute("data-name");

        if (avion === nombre) {
            pair.drop.style.backgroundColor = "#2ecc71";
            correctas++;
        } else {
            pair.drop.style.backgroundColor = "#e74c3c";
        }
    });

    const resultado = document.getElementById("resultado");
    if (correctas === 4) {
        resultado.textContent = "¡Perfecto! Todos los aviones están correctamente conectados.";
    } else {
        resultado.textContent = `Has conectado ${correctas} de 4 correctamente. ¡Sigue intentando!`;
    }
}


