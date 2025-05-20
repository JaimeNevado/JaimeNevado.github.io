function eliminarAmigo(elementoEntry) {
    const nombreSpan = elementoEntry.querySelector('span:first-child');
    const nombreAmigo = nombreSpan ? nombreSpan.textContent : null;

    if (!nombreAmigo) {
        console.error("No se pudo obtener el nombre del amigo.");
        return;
    }

    const confirmacion = window.confirm(`¿Estás seguro de que quieres eliminar a ${nombreAmigo} de tu lista de amigos?`);

    if (confirmacion) {
        console.log(`Eliminando a ${nombreAmigo}...`);
        elementoEntry.remove();

        const datos = localStorage.getItem("listaAmigos");
        if (datos) {
            let amigos = JSON.parse(datos);
            amigos = amigos.filter(amigo => amigo.nombre !== nombreAmigo);
            localStorage.setItem("listaAmigos", JSON.stringify(amigos));
        }
    } else {
        console.log(`Eliminación de ${nombreAmigo} cancelada.`);
    }
}
