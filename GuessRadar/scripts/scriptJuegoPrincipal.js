document.addEventListener('DOMContentLoaded', () => {
const aviones = [
    { id: 'avion1', x: 150, y: 100, dx: 0.2, dy: 0.1, tipo: 'Comercial', vuelo: 'UX1234', destino: 'Madrid' },
    { id: 'avion2', x: 500, y: 250, dx: -0.2, dy: 0.1, tipo: 'Privado', vuelo: 'PR4321', destino: 'Barcelona' },
    { id: 'avion3', x: 900, y: 500, dx: 0.2, dy: -0.1, tipo: 'Militar', vuelo: 'MT5678', destino: 'Sevilla' },
    { id: 'avion4', x: 1400, y: 650, dx: -0.2, dy: 0.1, tipo: 'Comercial', vuelo: 'UX9876', destino: 'Valencia' }
];


    const menu = document.getElementById('menuInfo');
    const form = document.getElementById('formAvion');
    const resultado = document.getElementById('resultadoVerificacion');
    const cerrarBtn = document.getElementById('cerrarMenu');

    let avionSeleccionado = null;
    let animacionActiva = true;

    aviones.forEach(avion => {
        const el = document.getElementById(avion.id);
        el.style.position = 'absolute';
        el.style.left = `${avion.x}px`;
        el.style.top = `${avion.y}px`;

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            avionSeleccionado = avion;
            animacionActiva = false;

            aviones.forEach(a => {
                const otherEl = document.getElementById(a.id);
                otherEl.style.filter = a.id === avion.id ? 'brightness(2) saturate(2)' : 'none';
            });

            const rect = el.getBoundingClientRect();
            let menuTop = rect.top + window.scrollY;
            let menuLeft = rect.left + rect.width + 10;

            const menuWidth = menu.offsetWidth;
            if (menuLeft + menuWidth > window.innerWidth) {
                menuLeft = rect.left - menuWidth - 10;
            }

            document.getElementById('tipoAvion').value = avion.tipo;
            document.getElementById('numeroVuelo').value = avion.vuelo;
            document.getElementById('destino').value = avion.destino;
            resultado.textContent = '';
            resultado.className = 'resultado-verificacion';

            menu.classList.add('visible');
        });
    });

    const container = document.querySelector('.mapa-container');

function moverAviones() {
    if (!animacionActiva) {
        requestAnimationFrame(moverAviones);
        return;
    }

    const bounds = container.getBoundingClientRect();

    aviones.forEach(avion => {
        avion.x += avion.dx;
        avion.y += avion.dy;

        const el = document.getElementById(avion.id);
        const avionWidth = el.offsetWidth;
        const avionHeight = el.offsetHeight;

        if (avion.x < 0) {
            avion.x = 0;
            avion.dx *= -1;
        }
        if (avion.x > bounds.width - avionWidth) {
            avion.x = bounds.width - avionWidth;
            avion.dx *= -1;
        }
        if (avion.y < 0) {
            avion.y = 0;
            avion.dy *= -1;
        }
        if (avion.y > bounds.height - avionHeight) {
            avion.y = bounds.height - avionHeight;
            avion.dy *= -1;
        }

        el.style.left = `${avion.x}px`;
        el.style.top = `${avion.y}px`;

        const angle = Math.atan2(avion.dy, avion.dx) * (180 / Math.PI) + 90;
        el.style.transform = `rotate(${angle}deg)`;
    });

    requestAnimationFrame(moverAviones);
}


    moverAviones();

    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tipo = document.getElementById('tipoAvion').value;
        const vuelo = document.getElementById('numeroVuelo').value.trim();
        const destino = document.getElementById('destino').value.trim();

        if (
            tipo === avionSeleccionado.tipo &&
            vuelo === avionSeleccionado.vuelo &&
            destino === avionSeleccionado.destino
        ) {
            resultado.textContent = "¡Datos correctos!";
            resultado.classList.remove('incorrecto');
            resultado.classList.add('correcto');
        } else {
            resultado.textContent = "Datos incorrectos. Inténtalo nuevamente.";
            resultado.classList.remove('correcto');
            resultado.classList.add('incorrecto');
        }
    });

    // 👉 Botón cerrar
    cerrarBtn.addEventListener('click', () => {
        avionSeleccionado = null;
        menu.classList.remove('visible');
        animacionActiva = true;

        aviones.forEach(avion => {
            const el = document.getElementById(avion.id);
            el.style.filter = 'none';
        });
    });
});
