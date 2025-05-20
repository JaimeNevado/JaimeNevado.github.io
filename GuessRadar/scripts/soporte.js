document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !correo || !mensaje) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Simulación de envío (puedes conectarlo a un backend real aquí)
        console.log("Mensaje enviado:");
        console.log(`Nombre: ${nombre}`);
        console.log(`Correo: ${correo}`);
        console.log(`Mensaje: ${mensaje}`);

        alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');

        form.reset();
    });
});
