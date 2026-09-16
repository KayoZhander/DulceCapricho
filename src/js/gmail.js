document.addEventListener('DOMContentLoaded', () => {
    const formRecuperar = document.getElementById('form-recuperar');
    const formCodigo = document.getElementById('form-codigo');
    const modalGmail = document.getElementById('modal-gmail');
    const cerrarModal = document.getElementById('cerrar-modal');
    const elemCodigo = document.getElementById('codigo-generado');
    const inputCodigo = document.getElementById('input-codigo');

    let codigoValido = null;

    // 1. Manejar solicitud de envío de correo
    formRecuperar.addEventListener('submit', (e) => {
        e.preventDefault();
        const correo = document.getElementById('correo-recuperar').value;

        if (!correo) return;

        // Generar código de 6 dígitos al azar
        codigoValido = Math.floor(100000 + Math.random() * 900000).toString();
        elemCodigo.innerText = codigoValido;

        // Mostrar la ventana simulada de Gmail en pantalla
        modalGmail.style.display = 'block';

        // Ocultar formulario de correo y mostrar formulario de validación
        formRecuperar.style.display = 'none';
        formCodigo.style.display = 'block';

        alert(`Se ha enviado una simulación de correo a: ${correo}.\nRevisa la notificación de Gmail que apareció abajo a la derecha.`);
    });

    // 2. Cerrar ventana modal de Gmail
    cerrarModal.addEventListener('click', () => {
        modalGmail.style.display = 'none';
    });

    // 3. Validar código ingresado por el usuario
    formCodigo.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigoIngresado = inputCodigo.value.trim();

        if (codigoIngresado === codigoValido) {
            alert('¡Código verificado con éxito! Redirigiendo a la sesión...');

            // Simulación de inicio de sesión / recuperación exitosa
            localStorage.setItem('usuario_logueado', 'true');
            window.location.href = 'cuenta.html';
        } else {
            alert('El código ingresado es incorrecto. Verifica el valor enviado en la notificación de Gmail.');
        }
    });
});
