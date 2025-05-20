// ==========================================================================
// ============= Código que se ejecuta al cargar el DOM =====================
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM Clasificación cargado. Configurando listeners...");

    // Seleccionar elementos por ID
    const inputBusqueda = document.getElementById('inputBuscarUsuario');
    const listaClasificacionContainer = document.getElementById('listaClasificacion'); // El div .leaderboard

    // Verifica que los elementos esenciales existen
    if (inputBusqueda && listaClasificacionContainer) {
        console.log("Input de búsqueda y lista de clasificación encontrados.");

        inputBusqueda.addEventListener('input', function () {
            const searchTerm = this.value.trim().toLowerCase();
            // Seleccionar todas las entradas DENTRO del contenedor de la lista
            const clasificacionEntries = listaClasificacionContainer.querySelectorAll('.entry');
            let visibleCount = 0; // Contador para entradas visibles

            // Filtrar entradas y contar visibles
            clasificacionEntries.forEach(entry => {
                // Seleccionar el span del nombre de usuario (el segundo span)
                const nombreSpan = entry.querySelector('span:nth-child(2)');

                if (nombreSpan) {
                    const nombreUsuario = nombreSpan.textContent.toLowerCase();

                    // Comprobar si el nombre de usuario INCLUYE el término de búsqueda
                    if (nombreUsuario.includes(searchTerm)) {
                        entry.style.display = ''; // Mostrar (usa display por defecto 'flex')
                        visibleCount++;
                    } else {
                        entry.style.display = 'none'; // Ocultar
                    }
                } else {
                    console.warn("Se encontró una entrada .entry sin el segundo span (nombre):", entry);
                }
            });

            // --- Lógica para crear/eliminar el mensaje "No resultados" ---
            const mensajeId = 'noResultsMessageDynamic'; // ID para el mensaje creado por JS
            let noResultsDiv = document.getElementById(mensajeId);

            // Condición para mostrar el mensaje: No hay resultados Y se buscó algo
            if (visibleCount === 0 && searchTerm !== '') {
                // Si el mensaje NO existe AÚN, créalo
                if (!noResultsDiv) {
                    noResultsDiv = document.createElement('div');
                    noResultsDiv.id = mensajeId;
                    noResultsDiv.className = 'no-results-message'; // Clase para CSS
                    noResultsDiv.textContent = 'No se encontró ningún usuario con ese nombre'; // Texto específico
                    listaClasificacionContainer.appendChild(noResultsDiv); // Añadir al final
                }
            } else {
                // Condición para ocultar/eliminar: Hay resultados O la búsqueda está vacía
                // Si el mensaje SÍ existe, elimínalo
                if (noResultsDiv) {
                    noResultsDiv.remove();
                }
            }
            // ---------------------------------------------

        });

    } else {
        // Errores si faltan elementos
        if (!inputBusqueda) console.error("Error crítico: No se encontró '#inputBuscarUsuario'.");
        if (!listaClasificacionContainer) console.error("Error crítico: No se encontró '#listaClasificacion'.");
        console.error("El filtrado de la clasificación podría no funcionar.");
    }

}); // --- Fin del listener DOMContentLoaded ---