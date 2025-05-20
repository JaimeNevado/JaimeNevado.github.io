function mostrarFormulario() {
    const formulario = document.getElementById('formularioAmigo');
    if (formulario) {
        formulario.classList.toggle('visible');
    } else {
        console.error("Error: No se encontró el elemento con ID 'formularioAmigo'.");
    }
}

function guardarAmigosEnLocalStorage() {
    const lista = document.getElementById("listaAmigos");
    const amigos = [];

    lista.querySelectorAll(".entry").forEach(entry => {
        const spans = entry.querySelectorAll("span");
        if (spans.length >= 2) {
            amigos.push({
                nombre: spans[0].textContent,
                nivel: spans[1].textContent.replace("Nv.", "")
            });
        }
    });

    localStorage.setItem("listaAmigos", JSON.stringify(amigos));
}

function cargarAmigosDesdeLocalStorage() {
    const datos = localStorage.getItem("listaAmigos");
    if (!datos) return;

    const lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";

    const amigos = JSON.parse(datos);

    amigos.forEach(amigo => {
        const entry = document.createElement("div");
        entry.className = "entry";

        const nombreSpan = document.createElement("span");
        nombreSpan.textContent = amigo.nombre;
        entry.appendChild(nombreSpan);

        const nivelSpan = document.createElement("span");
        nivelSpan.textContent = `Nv.${amigo.nivel}`;
        entry.appendChild(nivelSpan);

        const eliminarBtn = document.createElement("img");
        eliminarBtn.src = "../../images/eliminar.png";
        eliminarBtn.alt = "Eliminar amigo";
        eliminarBtn.className = "delete-icon";
        eliminarBtn.onclick = function () {
            eliminarAmigo(entry);
        };
        entry.appendChild(eliminarBtn);

        lista.appendChild(entry);
    });
}

function agregarAmigo() {
    const nombreInput = document.getElementById("nuevoNombre");
    const nivelInput = document.getElementById("nuevoNivel");
    const formulario = document.getElementById("formularioAmigo");
    const lista = document.getElementById("listaAmigos");

    if (!nombreInput || !nivelInput || !formulario || !lista) {
        console.error("Error: Faltan elementos del formulario o la lista para agregar amigo.");
        alert("Ocurrió un error al intentar agregar el amigo. Revisa la consola.");
        return;
    }

    const nombre = nombreInput.value.trim();
    const nivel = nivelInput.value.trim();

    if (nombre && nivel && !isNaN(nivel)) {
        const entry = document.createElement("div");
        entry.className = "entry";

        const nombreSpan = document.createElement("span");
        nombreSpan.textContent = nombre;
        entry.appendChild(nombreSpan);

        const nivelSpan = document.createElement("span");
        nivelSpan.textContent = `Nv.${nivel}`;
        entry.appendChild(nivelSpan);

        const eliminarBtn = document.createElement("img");
        eliminarBtn.src = "../../images/eliminar.png";
        eliminarBtn.alt = "Eliminar amigo";
        eliminarBtn.className = "delete-icon";
        eliminarBtn.onclick = function () {
            eliminarAmigo(entry);
        };
        entry.appendChild(eliminarBtn);

        lista.appendChild(entry);

        nombreInput.value = "";
        nivelInput.value = "";
        formulario.classList.remove('visible');

        guardarAmigosEnLocalStorage();
    } else {
        alert("Por favor, introduce un nombre válido y un nivel numérico.");
    }
}

function eliminarAmigo(elementoEntry) {
    const nombreSpan = elementoEntry.querySelector('span:first-child');
    const nombreAmigo = nombreSpan ? nombreSpan.textContent : 'este amigo';

    const confirmacion = window.confirm(`¿Estás seguro de que quieres eliminar a ${nombreAmigo} de tu lista de amigos?`);

    if (confirmacion) {
        elementoEntry.remove();
        guardarAmigosEnLocalStorage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarAmigosDesdeLocalStorage();

    const inputBusqueda = document.getElementById('inputBuscarAmigo');
    const listaAmigosContainer = document.getElementById('listaAmigos');

    if (inputBusqueda && listaAmigosContainer) {
        inputBusqueda.addEventListener('input', function () {
            const searchTerm = this.value.trim().toLowerCase();
            const amigosEntries = listaAmigosContainer.querySelectorAll('.entry');
            let visibleCount = 0;

            amigosEntries.forEach(entry => {
                const nombreSpan = entry.querySelector('span:first-child');
                if (nombreSpan) {
                    const nombreAmigo = nombreSpan.textContent.toLowerCase();
                    if (nombreAmigo.includes(searchTerm)) {
                        entry.style.display = '';
                        visibleCount++;
                    } else {
                        entry.style.display = 'none';
                    }
                }
            });

            const mensajeId = 'noResultsMessageDynamic';
            let noResultsDiv = document.getElementById(mensajeId);

            if (visibleCount === 0 && searchTerm !== '') {
                if (!noResultsDiv) {
                    noResultsDiv = document.createElement('div');
                    noResultsDiv.id = mensajeId;
                    noResultsDiv.className = 'no-results-message';
                    noResultsDiv.textContent = 'No se encontró ningún amigo con ese nombre';
                    listaAmigosContainer.appendChild(noResultsDiv);
                }
            } else {
                if (noResultsDiv) {
                    noResultsDiv.remove();
                }
            }
        });
    } else {
        if (!inputBusqueda) console.error("Error: No se encontró '#inputBuscarAmigo'.");
        if (!listaAmigosContainer) console.error("Error: No se encontró '#listaAmigos'.");
    }
});
