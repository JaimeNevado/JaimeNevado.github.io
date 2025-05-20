const ordenCorrecto = ['Boeing 737', 'Boeing 727', 'Airbus A320', 'Airbus 340'];

function moverArriba(filaId) {
  const fila = document.getElementById(filaId);
  const prev = fila.previousElementSibling;
  if (prev) {
    fila.parentNode.insertBefore(fila, prev);
  }
}

function moverAbajo(filaId) {
  const fila = document.getElementById(filaId);
  const next = fila.nextElementSibling;
  if (next) {
    fila.parentNode.insertBefore(next, fila);
  }
}

function verificar() {
  const filas = document.querySelectorAll('.fila');
  let resultado = [];
  let correcto = true;

  filas.forEach(fila => {
    const avion = fila.querySelector('.avion');
    if (avion) {
      resultado.push(avion.textContent.trim());
    }
  });

  if (JSON.stringify(resultado) === JSON.stringify(ordenCorrecto)) {
    document.getElementById('resultado').textContent = '¡Correcto! Has ordenado los aviones correctamente.';
    document.querySelectorAll('.avion').forEach(avion => {
      avion.classList.add('correcto');
    });
  } else {
    document.getElementById('resultado').textContent = '¡Ups! Intenta de nuevo.';
    filas.forEach((fila, index) => {
      const avion = fila.querySelector('.avion');
      if (avion) {
        if (avion.textContent.trim() === ordenCorrecto[index]) {
          avion.classList.add('correcto');
        } else {
          avion.classList.add('incorrecto');
        }
      }
    });
  }
}

function reintentar() {
  const filas = document.querySelectorAll('.fila');

  filas.forEach(fila => {
    const avion = fila.querySelector('.avion');
    if (avion) {
      avion.classList.remove('correcto', 'incorrecto');
    }
  });

  filas.forEach((fila, index) => {
    fila.style.order = '';
  });

  document.getElementById('resultado').textContent = '';
}
