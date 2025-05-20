document.addEventListener('DOMContentLoaded', () => {
  const idioma = document.getElementById('idioma');
  const region = document.getElementById('region');
  const sonido = document.getElementById('sonido');
  const efectos = document.getElementById('efectosSonido');
  const notificaciones = document.getElementById('notificaciones');
  const musica = document.getElementById('musicaFondo'); // el elemento <audio>
  const sliderContainer = document.getElementById('slider-container');
  const volumenSlider = document.getElementById('volumen');

  // Aplicar idioma guardado
  const idiomaGuardado = localStorage.getItem('idiomaSeleccionado');
  if (idiomaGuardado) {
    idioma.value = idiomaGuardado;
    aplicarTraducciones(idiomaGuardado);
  }

  // Aplicar estado de sonido guardado
  const sonidoGuardado = localStorage.getItem('sonidoActivado') === 'true';
  sonido.checked = sonidoGuardado;

  if (sonidoGuardado) {
    musica.play().catch(err => console.log('Autoplay bloqueado por el navegador:', err));
    sliderContainer.style.display = 'block'; // Mostrar el slider
    volumenSlider.value = localStorage.getItem('volumen') || 1; // Restablecer volumen si hay uno guardado
    musica.volume = volumenSlider.value;
  }

  // Listeners
  [idioma, region, sonido, efectos, notificaciones].forEach(elemento => {
    elemento.addEventListener('change', () => {
      const valor = elemento.type === 'checkbox' ? elemento.checked : elemento.value;
      console.log(`Cambió la opción: ${elemento.id} = ${valor}`);

      switch (elemento.id) {
        case 'idioma':
          localStorage.setItem('idiomaSeleccionado', valor);
          aplicarTraducciones(valor);
          break;

        case 'sonido':
          localStorage.setItem('sonidoActivado', valor);
          if (valor) {
            musica.play().catch(err => console.log('Autoplay bloqueado por el navegador:', err));
            sliderContainer.style.display = 'block'; // Mostrar el slider
          } else {
            musica.pause();
            sliderContainer.style.display = 'none'; // Ocultar el slider
          }
          break;

        case 'efectosSonido':
          // Puedes agregar el código para manejar los efectos de sonido aquí
          break;

        case 'notificaciones':
          // Puedes agregar el código para manejar las notificaciones aquí
          break;
      }
    });
  });

  // Listener para el slider de volumen
  volumenSlider.addEventListener('input', () => {
    const volumen = volumenSlider.value;
    musica.volume = volumen;
    localStorage.setItem('volumen', volumen); // Guardar el volumen en el almacenamiento local
  });
});

function aplicarTraducciones(idioma) {
  const traducciones = {
    'Español': {
      'options-title': 'Opciones',
      'idioma': 'Idioma:',
      'region': 'Ciudad o Región:',
      'sonido': 'Música',
      'efectosSonido': 'Efectos de Sonido',
      'notificaciones': 'Notificaciones',
      'modoCiego': 'Modo Ciego (próximamente)',
      'bloqueo': 'Bloquear Solicitudes (próximamente)'
    },
    'Inglés': {
      'options-title': 'Settings',
      'idioma': 'Language:',
      'region': 'City or Region:',
      'sonido': 'Music',
      'efectosSonido': 'Sound Effects',
      'notificaciones': 'Notifications',
      'modoCiego': 'Blind Mode (coming soon)',
      'bloqueo': 'Block Requests (coming soon)'
    },
    'Francés': {
      'options-title': 'Paramètres',
      'idioma': 'Langue :',
      'region': 'Ville ou région :',
      'sonido': 'Musique',
      'efectosSonido': 'Effets sonores',
      'notificaciones': 'Notifications',
      'modoCiego': 'Mode aveugle (bientôt)',
      'bloqueo': 'Bloquer les demandes (bientôt)'
    }
  };


  document.querySelector('.options-title').textContent = t['options-title'];
  document.querySelector('label[for="idioma"]').textContent = t['idioma'];
  document.querySelector('label[for="region"]').textContent = t['region'];

  document.getElementById('sonido').nextElementSibling.textContent = t['sonido'];
  document.getElementById('efectosSonido').nextElementSibling.textContent = t['efectosSonido'];
  document.getElementById('notificaciones').nextElementSibling.textContent = t['notificaciones'];

  const spans = document.querySelectorAll('.option-item.disabled span');
  if (spans.length >= 2) {
    spans[0].textContent = t['modoCiego'];
    spans[1].textContent = t['bloqueo'];
  }
}
const dificultad = document.getElementById('dificultad');
const tiempoLimite = document.getElementById('tiempoLimite');
const modoUnico = document.getElementById('modoUnico');

// Aplicar valores guardados
dificultad.value = localStorage.getItem('dificultadSeleccionada') || 'normal';
tiempoLimite.checked = localStorage.getItem('tiempoLimiteActivado') === 'true';
modoUnico.value = localStorage.getItem('modoUnicoSeleccionado') || 'todos';

// Guardar cambios al cambiar algo
[dificultad, tiempoLimite, modoUnico].forEach(elemento => {
  elemento.addEventListener('change', () => {
    const valor = elemento.type === 'checkbox' ? elemento.checked : elemento.value;
    console.log(`Cambio en ajustes: ${elemento.id} = ${valor}`);

    switch (elemento.id) {
      case 'dificultad':
        localStorage.setItem('dificultadSeleccionada', valor);
        break;
      case 'tiempoLimite':
        localStorage.setItem('tiempoLimiteActivado', valor);
        break;
      case 'modoUnico':
        localStorage.setItem('modoUnicoSeleccionado', valor);
        break;
    }
  });
});

