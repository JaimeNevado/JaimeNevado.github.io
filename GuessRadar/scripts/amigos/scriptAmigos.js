document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado. Configurando listeners...");

    const inputBusqueda = document.getElementById('inputBuscarAmigo');
    const listaAmigosContainer = document.getElementById('listaAmigos');

    if (inputBusqueda && listaAmigosContainer) {
        console.log("Elementos para filtrado encontrados.");

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
        if (!inputBusqueda) console.error("Error crítico: No se encontró '#inputBuscarAmigo'.");
        if (!listaAmigosContainer) console.error("Error crítico: No se encontró '#listaAmigos'.");
        console.error("El filtrado y/o mensaje de 'no resultados' podrían no funcionar.");
    }
});
