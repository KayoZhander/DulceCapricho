// redireccionar a la pagina cuenta si ya inicío sesión
if (localStorage.getItem("sesion")) {
	window.location.href = "/cuenta.html"
}

import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const formularioLogin = document.querySelector("#login-form");
const inputPassword = document.querySelector("#password");

formularioLogin.addEventListener("submit", async (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());
	const usuario = RegistroUsuarios.obtenerUsuarioPorCorreo(valores.email);

	// await usuario.validarPassword(valores.password);
	if (!usuario || !(await usuario?.validarPassword(valores.password))) {
		alert("Correo o contraseña incorrectos.");
		return;
	}

	localStorage.setItem("sesion", JSON.stringify(usuario));
	window.location.href = "/index.html";
});

// que la contraseña no contenga espacios ni tildes
const regexPassword = /[^\w\p{P}\p{S}]+/gu;

inputPassword.addEventListener("input", (event) => {
	event.target.value = event.target.value.replace(regexPassword, "");
});
