document.addEventListener('DOMContentLoaded', () =>{
    const form = document.getElementById('form-contacto');
    const mensajeEstado = document.createElement('p');
    mensajeEstado.className = 'form-mensaje';
    form.appendChild(mensajeEstado);

    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        const errores = [];

        if (nombre.length < 2){
            errores.push('El nombre debe tener al menos 2 caracteres.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errores.push('Ingresa un correo valido');
        }

        if (telefono && !/^\d{10}$/.test(telefono)) {
            errores.push('Ingresa un telefono valido (o dejalo vacio)');
        }

        if (mensaje.length < 10) {
            errores.push("El mensaje debe tener al menos 10 caracteres.");
        }

        if (errores.length > 0) {
            mostrarMensaje(errores.join(' '), 'error');
            return;
        }

        mostrarMensaje(`Gracias, ${nombre}! Hemos recibido tu mensaje`, 'exito');
        form.reset();
    });

    function mostrarMensaje(texto, tipo){
        mensajeEstado.textContent = texto;
        mensajeEstado.className = `form-mensaje ${tipo}`;
    }

});
