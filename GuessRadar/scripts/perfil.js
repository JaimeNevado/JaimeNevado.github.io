// ===============================
// Constantes y Elementos del DOM
// ===============================
const fotoPerfilElement = document.getElementById("fotoPerfil");
const inputFotoPerfilElement = document.getElementById('inputFotoPerfil');
const avionFavoritoSelectElement = document.getElementById('avionFavorito');
const imagenAvionFavoritoElement = document.getElementById('imagenAvionFavorito');
const nombreUsuarioElement = document.getElementById('nombreUsuario');
const cerrarSesionBtnMainElement = document.getElementById('cerrarSesionBtnMain');

const aviones = {
  "Boeing 747": "../../images/avionesPerfil/boeing747.png",
  "Airbus A380": "../../images/avionesPerfil/airbusA380.png",
  "Concorde": "../../images/avionesPerfil/concorde.png",
  "F-22 Raptor": "../../images/avionesPerfil/f22raptor.png",
  "F-16 Falcon": "../../images/avionesPerfil/f16falcon.png",
  "Cessna 172": "../../images/avionesPerfil/cessna172.png",
  "Lockheed SR-71": "../../images/avionesPerfil/lockheedsr71.png",
  "Boeing 737": "../../images/avionesPerfil/boeing737.png",
  "Airbus A320": "../../images/avionesPerfil/airbusa320.png", // Asegúrate que esta imagen exista
  "Antonov An-225": "../../images/avionesPerfil/antonovAn225.png",
  "Douglas DC-3": "../../images/avionesPerfil/douglasdc3.png",
  "Spitfire": "../../images/avionesPerfil/spitfire.png",
  "Messerschmitt Bf 109": "../../images/avionesPerfil/messerschmittbf109.png", // Asegúrate que esta imagen exista
  "Lockheed C-130": "../../images/avionesPerfil/lockheedc130.png",
  "Mig-29 Fulcrum": "../../images/avionesPerfil/mig29Fulcrum.png"
};

// ===============================
// Foto de perfil
// ===============================
// La función cambiarFoto() es llamada por onclick en el HTML:
// <button onclick="document.getElementById('inputFotoPerfil').click();">Cambiar Foto</button>
// Si prefieres una función aquí, el botón sería <button onclick="cambiarFoto()">Cambiar Foto</button>
// y definirías aquí:
// function cambiarFoto() {
//   if (inputFotoPerfilElement) inputFotoPerfilElement.click();
// }

if (inputFotoPerfilElement) {
  inputFotoPerfilElement.addEventListener('change', function (e) {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = function (event) {
        const imgData = event.target.result;
        if (fotoPerfilElement) {
          fotoPerfilElement.src = imgData;
        }
        // Guardar la foto de perfil asociada al usuario actual
        const usuarioLogueado = localStorage.getItem("usuarioActual");
        if (usuarioLogueado) {
            localStorage.setItem(`fotoPerfil_${usuarioLogueado}`, imgData);
        } else {
            localStorage.setItem('fotoPerfil_default', imgData); // Fallback si no hay usuario
        }
      };
      lector.readAsDataURL(archivo);
    }
  });
}

// ===============================
// Avión favorito
// ===============================
if (avionFavoritoSelectElement) {
  avionFavoritoSelectElement.addEventListener('change', function () {
    const avionSeleccionado = this.value;
    const usuarioLogueado = localStorage.getItem("usuarioActual");

    if (usuarioLogueado) {
        localStorage.setItem(`avionFavorito_${usuarioLogueado}`, avionSeleccionado);
    } else {
        localStorage.setItem('avionFavorito_default', avionSeleccionado); // Fallback
    }


    if (imagenAvionFavoritoElement && aviones[avionSeleccionado]) {
      imagenAvionFavoritoElement.src = aviones[avionSeleccionado];
    } else if (imagenAvionFavoritoElement) {
      // Si el avión seleccionado no está en el objeto 'aviones' o es la opción "Selecciona..."
      imagenAvionFavoritoElement.src = "../../images/perfil/noPlaneSeleccion.png";
    }
  });
}

// ===============================
// Funcionalidad de Cerrar Sesión
// ===============================
function ejecutarCierreSesion() {
  console.log("Cerrando sesión...");

  // Obtener el usuario actual para limpiar sus datos específicos
  const usuarioLogueado = localStorage.getItem("usuarioActual");

  // Limpiar datos generales y específicos del usuario si existe
  if (usuarioLogueado) {
    localStorage.removeItem(`fotoPerfil_${usuarioLogueado}`);
    localStorage.removeItem(`avionFavorito_${usuarioLogueado}`);
    // Puedes añadir aquí la eliminación de otras preferencias específicas del usuario
  }
  // Limpiar datos de sesión generales
  localStorage.removeItem("usuarioActual"); // Clave principal de sesión
  // localStorage.removeItem('isLoggedIn'); // Si usas una clave general de estado de sesión

  // Redirigir a la página de login
  // Asegúrate de que la ruta a login.html sea correcta desde perfil.html
  window.location.href = "../ventanasPrincipales/login.html";
}

if (cerrarSesionBtnMainElement) {
  cerrarSesionBtnMainElement.addEventListener('click', ejecutarCierreSesion);
}

// ===============================
// Cargar datos al iniciar la página
// ===============================
window.addEventListener("DOMContentLoaded", function () {
  const usuarioLogueado = localStorage.getItem("usuarioActual");

  // Cargar nombre de usuario
  if (nombreUsuarioElement) {
    if (usuarioLogueado) {
      nombreUsuarioElement.textContent = usuarioLogueado;
    } else {
      nombreUsuarioElement.textContent = "Usuario"; // Placeholder si no hay usuario logueado
      console.warn("PERFIL.JS: No se encontró 'usuarioActual' en localStorage. Mostrando placeholder para nombre.");
    }
  }

  // Cargar foto de perfil específica del usuario
  if (fotoPerfilElement) {
    let imagenGuardada = null;
    if (usuarioLogueado) {
        imagenGuardada = localStorage.getItem(`fotoPerfil_${usuarioLogueado}`);
    }
    // Si no hay foto para el usuario o no hay usuario, intenta cargar una 'default' o la base
    if (!imagenGuardada) imagenGuardada = localStorage.getItem('fotoPerfil_default');

    if (imagenGuardada) {
      fotoPerfilElement.src = imagenGuardada;
    } else {
      fotoPerfilElement.src = "../../images/perfil/fotoPerfil.png"; // Imagen por defecto si no hay nada guardado
    }
  }

  // Cargar avión favorito específico del usuario
  if (avionFavoritoSelectElement && imagenAvionFavoritoElement) {
    let avionGuardado = null;
    if (usuarioLogueado) {
        avionGuardado = localStorage.getItem(`avionFavorito_${usuarioLogueado}`);
    }
    // Si no hay avión para el usuario o no hay usuario, intenta cargar uno 'default'
    if (!avionGuardado) avionGuardado = localStorage.getItem('avionFavorito_default');


    if (avionGuardado && aviones[avionGuardado]) {
      avionFavoritoSelectElement.value = avionGuardado;
      imagenAvionFavoritoElement.src = aviones[avionGuardado];
    } else {
      imagenAvionFavoritoElement.src = "../../images/perfil/noPlaneSeleccion.png"; // Imagen por defecto
    }
  }

 
});