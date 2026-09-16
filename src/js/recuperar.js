import { RegistroUsuarios } from "./usuarios.mjs";

// Redireccionar si ya existe sesión activa
if (localStorage.getItem("sesion")) {
    window.location.href = "/cuenta.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const formRecuperar = document.getElementById('form-recuperar');
    const formCodigo = document.getElementById('form-codigo');
    const modalGmail = document.getElementById('modal-gmail');
    const cerrarModal = document.getElementById('cerrar-modal');
    const elemCodigo = document.getElementById('codigo-generado');
    const inputCodigo = document.getElementById('input-codigo');

    let codigoValido = null;
    let usuarioEncontrado = null;

    // Paso 1: Validar correo y simular envío en Gmail
    formRecuperar.addEventListener('submit', (e) => {
        e.preventDefault();
        const correo = document.getElementById('email').value.trim().toLowerCase();

        // Verificar si el correo existe en el sistema
        if (!RegistroUsuarios.correoExiste(correo)) {
            alert("El correo ingresado no se encuentra registrado.");
            return;
        }

        usuarioEncontrado = RegistroUsuarios.obtenerUsuarioPorCorreo(correo);

        // Generar código aleatorio de 6 dígitos
        codigoValido = Math.floor(100000 + Math.random() * 900000).toString();
        elemCodigo.innerText = codigoValido;

        // Desplegar la ventana flotante de Gmail y cambiar de formulario
        modalGmail.style.display = 'block';
        formRecuperar.style.display = 'none';
        formCodigo.style.display = 'block';
    });

    // Cerrar el modal simulador
    cerrarModal.addEventListener('click', () => {
        modalGmail.style.display = 'none';
    });

    // Paso 2: Validar código ingresado e iniciar sesión
    formCodigo.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigoIngresado = inputCodigo.value.trim();

        if (codigoIngresado === codigoValido) {
            alert('¡Código correcto! Accediendo a la cuenta...');

            // Guardar objeto de usuario en la clave de sesión activa
            localStorage.setItem("sesion", JSON.stringify(usuarioEncontrado.toJSON()));
            window.location.href = "/index.html";
        } else {
            alert('El código ingresado es incorrecto. Revisa el código en la notificación flotante de Gmail.');
        }
    });
});
