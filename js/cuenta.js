// redireccionar a la pagina login si no tiene cuenta
if (!localStorage.getItem("user")) {
	window.location.href = "login.html"
}
