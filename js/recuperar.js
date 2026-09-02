// redireccionar a la pagina cuenta si ya inicío sesión
if (localStorage.getItem("sesion")) {
	window.location.href = "cuenta.html"
}

const formularioLogin = document.querySelector("#login-form");
const botonOlvideCorreo = document.querySelector("#login-links-olvide-correo");

formularioLogin.addEventListener("submit", (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());

    if (!validarRut(valores.rut)) {
        alert("El RUT ingresado no es valido");
        return;
    }

	localStorage.setItem("sesion", JSON.stringify(valores));
	window.location.href = "index.html";
});

botonOlvideCorreo.addEventListener("click", (event) => {
    event.preventDefault();
    alert("ha ha");
});
