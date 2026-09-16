import { CarritoDulceCapricho } from "./carroDeCompras.mjs";

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('form-personalizar');
	const mensajeEstado = document.createElement('div');
	mensajeEstado.className = 'form-mensaje';
	form.appendChild(mensajeEstado);

	const preciosBase = {
		'torta de chocolate': 18000,
		'torta de frutilla': 22000,
		'torta de limon': 20000,
		'torta de blueberry': 99999,
	};

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const torta = document.getElementById('torta').value;
		const tamano = document.getElementById('tamano').value;
		const bizcocho = document.getElementById('bizcocho').value;
		const cobertura = document.getElementById('cobertura').value;
		const dedicatoria = document.getElementById('dedicatoria').value.trim();

		const rellenosSeleccionados = Array.from(
			document.querySelectorAll('input[name="relleno"]:checked')
		).map(input => input.value);

		const errores = [];

		if (!torta) errores.push('Elige una torta base.');
		if (!tamano) errores.push('Elige un tamaño.');
		if (!bizcocho) errores.push('Elige un tipo de bizcocho.');
		if (!cobertura) errores.push('Elige una cobertura.');
		if (rellenosSeleccionados.length === 0) errores.push('Elige al menos un relleno.');

		if (errores.length > 0) {
			mostrarMensaje(errores.join(' '), 'error');
			return;
		}

		const precio = preciosBase[torta.toLowerCase()] ?? 20000;
		const detalle = `Tamaño: ${tamano} · Bizcocho: ${bizcocho} · Rellenos: ${rellenosSeleccionados.join(', ')} · Cobertura: ${cobertura}${dedicatoria ? ` · Dedicatoria: "${dedicatoria}"` : ''}`;

		CarritoDulceCapricho.agregar({
			id: Date.now(),
			nombre: `${torta} personalizada`,
			precio: precio,
			detalle: detalle,
		}, 1);

		mostrarMensaje(`
			<strong>¡Torta personalizada agregada al carrito!</strong><br>
			${torta} personalizada — $${precio.toLocaleString('es-CL')}<br>
			${detalle}<br>
			<a href="carrito.html">Ver carrito →</a>
		`, 'exito');

		form.reset();
	});

	function mostrarMensaje(contenido, tipo) {
		mensajeEstado.innerHTML = contenido;
		mensajeEstado.className = `form-mensaje ${tipo}`;
	}
});
