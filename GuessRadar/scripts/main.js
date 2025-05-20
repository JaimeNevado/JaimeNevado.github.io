import { obtenerTraducciones } from './traducciones.js';

export function aplicarTraduccionGlobal(idsTraducibles) {
  const idioma = localStorage.getItem('idiomaSeleccionado') || 'Español';
  const t = obtenerTraducciones(idioma);

  idsTraducibles.forEach(id => {
    const el = document.getElementById(id);
    if (el && t[id]) {
      el.textContent = t[id];
    }
  });
}
