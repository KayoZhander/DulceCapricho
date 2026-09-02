// redireccionar a la pagina login si no tiene cuenta
if (!localStorage.getItem("sesion")) {
	window.location.href = "login.html"
}

const botonCerrarSesion = document.querySelector("#cerrar-sesion");
const botonEliminarCuenta = document.querySelector("#btn-eliminar-cuenta");

botonCerrarSesion.addEventListener("click", () => {
	if (!confirm("¿Seguro qué quieres cerrar sesión?")) {
		return;
	}
	localStorage.removeItem("sesion");
	window.location.href = "index.html";
});

botonEliminarCuenta.addEventListener("click", () => {
	if (!confirm("¿Seguro qué quieres eliminar la cuenta?")) {
		return;
	}
	if (!confirm("Si borras la cuenta, perderas todas tus tortas favoritas y pedidos realizados. Esta acción es irreversible. ¿Desea continuar?")) {
		return;
	}
	localStorage.removeItem("sesion");
	window.location.href = "index.html";
});
