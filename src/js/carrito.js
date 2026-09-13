import { Usuario, RegistroUsuarios } from "./usuarios.mjs";

const btnVaciarCarrito = document.querySelector("#btn-vaciar-carrito");

btnVaciarCarrito.addEventListener("click", () => {
	if (!confirm("¿Estás seguro de que deseas vaciar el carrito?\nEsta acción no se puede deshacer.")) {
		return;
	}
	localStorage.removeItem("carrito");
	window.location.reload();
});
