const sesionGuardada = localStorage.getItem("sesion");
if (sesionGuardada) {
	const usuarioSesion = JSON.parse(sesionGuardada);
	if (usuarioSesion?.rol === "admin") {
		window.location.href = "/tortas.html?admin=1";
	} else {
		window.location.href = "/cuenta.html";
	}
}

import { RegistroUsuarios, Usuario } from "./usuarios.mjs";

const formularioLogin = document.querySelector("#login-form");
const inputPassword = document.querySelector("#password");
const btnTogglePassword = document.querySelector("#toggle-password");

btnTogglePassword.addEventListener("click", (event) => {
	event.preventDefault();
	if (inputPassword.type === "password") {
		inputPassword.type = "text";
		btnTogglePassword.textContent = "Ocultar contraseña";
	} else {
		inputPassword.type = "password";
		btnTogglePassword.textContent = "Mostrar contraseña";
	}
});

formularioLogin?.addEventListener("submit", async (event) => {
	event.preventDefault();
	const valores = Object.fromEntries(new FormData(event.target).entries());
	let usuario = RegistroUsuarios.obtenerUsuarioPorCorreo(valores.email);

	if (!usuario && valores.email?.trim().toLowerCase() === "admin@dulcecapricho.com" && valores.password === "admin123") {
		usuario = await Usuario.crearAdminSiNoExiste();
	}

	if (!usuario || !(await usuario.validarPassword(valores.password))) {
		alert("Correo o contraseña incorrectos.");
		return;
	}

	localStorage.setItem("sesion", JSON.stringify(usuario.toJSON()));
	if (usuario.getRol() === "admin") {
		window.location.href = "/tortas.html?admin=1";
		return;
	}
	window.location.href = "/cuenta.html";
});

const regexPassword = /[^\w\p{P}\p{S}]+/gu;

inputPassword?.addEventListener("input", (event) => {
	event.target.value = event.target.value.replace(regexPassword, "");
});
