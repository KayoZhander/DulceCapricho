import { CatalogoTortas, Torta } from "./catalogo.mjs";
import { CarritoDulceCapricho } from "./carroDeCompras.mjs";

const listaTortas = document.querySelector("#tortas");
const sesion = (() => {
	try {
		return JSON.parse(localStorage.getItem("sesion") ?? "null");
	} catch {
		return null;
	}
})();
const esAdmin = sesion?.rol === "admin";

function crearTarjetaTorta(t, modoAdmin = false) {
	const tarjeta = document.createElement("article");
	tarjeta.classList.add("card");
	if (modoAdmin) tarjeta.classList.add("card-admin");

	const fondoImagen = document.createElement("div");
	fondoImagen.classList.add("photo-wrap");
	fondoImagen.style.setProperty("--tone-a", t.getTonoA());
	fondoImagen.style.setProperty("--tone-b", t.getTonoB());

	const imagen = document.createElement("img");
	imagen.src = t.getImagen() ?? "";
	imagen.alt = t.getNombre();
	if (t.getImagen()) {
		fondoImagen.appendChild(imagen);
	}

	const cuerpoTarjeta = document.createElement("div");
	cuerpoTarjeta.classList.add("card-body");

	const titulo = document.createElement("h3");
	titulo.textContent = t.getNombre();

	const descripcion = document.createElement("p");
	descripcion.textContent = t.getDetalle();

	const precio = document.createElement("span");
	precio.classList.add("price");
	precio.textContent = `\$${t.getPrecio().toLocaleString("es-CL")}`;

	if (modoAdmin) {
		const acciones = document.createElement("div");
		acciones.className = "card-actions";

		const btnEditar = document.createElement("button");
		btnEditar.type = "button";
		btnEditar.className = "btn btn-secondary";
		btnEditar.textContent = "Editar";
		btnEditar.addEventListener("click", () => {
			const form = document.querySelector("#admin-torta-form");
			if (!form) return;
			form.querySelector("[name='id']").value = t.getId();
			form.querySelector("[name='nombre']").value = t.getNombre();
			form.querySelector("[name='detalle']").value = t.getDetalle();
			form.querySelector("[name='precio']").value = t.getPrecio();
			form.querySelector("[name='imagen']").value = t.getImagen() ?? "";
			form.querySelector("[name='tonoA']").value = t.getTonoA();
			form.querySelector("[name='tonoB']").value = t.getTonoB();
			form.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		const btnEliminar = document.createElement("button");
		btnEliminar.type = "button";
		btnEliminar.className = "btn btn-danger";
		btnEliminar.textContent = "Eliminar";
		btnEliminar.addEventListener("click", () => {
			if (!confirm(`¿Deseas eliminar "${t.getNombre()}" del catálogo?`)) return;
			CatalogoTortas.eliminarTorta(t.getId());
			renderizarCatalogo();
		});

		acciones.append(btnEditar, btnEliminar);
		cuerpoTarjeta.append(titulo, descripcion, precio, acciones);
	} else {
		const boton = document.createElement("button");
		boton.type = "button";
		boton.className = "btn";
		boton.textContent = "Agregar al carrito";
		boton.addEventListener("click", () => {
			CarritoDulceCapricho.agregar({
				id: t.getId(),
				nombre: t.getNombre(),
				precio: t.getPrecio(),
				imagen: t.getImagen()
			}, 1);
			alert(`${t.getNombre()} se agregó al carrito.`);
		});
		cuerpoTarjeta.append(titulo, descripcion, precio, boton);
	}

	tarjeta.append(fondoImagen, cuerpoTarjeta);
	return tarjeta;
}

function renderizarCatalogo() {
	if (!listaTortas) return;
	listaTortas.innerHTML = "";
	CatalogoTortas.listaTortas().forEach((t) => {
		listaTortas.appendChild(crearTarjetaTorta(t, esAdmin));
	});
}

function inicializarAdmin() {
	const contenedor = document.querySelector(".cakes");
	if (!contenedor || !esAdmin) return;

	const panel = document.createElement("section");
	panel.className = "admin-panel";
	panel.innerHTML = `
		<div class="section-head">
			<span>Administración</span>
			<h2>Gestión del catálogo</h2>
		</div>
		<form id="admin-torta-form" class="admin-form">
			<input type="hidden" name="id" value="">
			<div class="campo">
				<label>Nombre</label>
				<input type="text" name="nombre" required>
			</div>
			<div class="campo">
				<label>Detalle</label>
				<input type="text" name="detalle" required>
			</div>
			<div class="campo"><label>Precio</label><input type="number" name="precio" min="0" step="1" required></div>
			<div class="campo"><label>Imagen</label><input type="text" name="imagen" placeholder="/images/..." required></div>
			<div class="campo"><label>Tono A</label><input type="color" name="tonoA" value="#5C3A2E"></div>
			<div class="campo"><label>Tono B</label><input type="color" name="tonoB" value="#8C5A44"></div>
			<div class="admin-form-actions">
				<button type="submit" class="btn">Guardar torta</button>
				<button type="button" id="btn-cancelar-admin" class="btn btn-secondary">Cancelar</button>
			</div>
		</form>
	`;

	const form = panel.querySelector("#admin-torta-form");
	const cancelar = panel.querySelector("#btn-cancelar-admin");
	cancelar.addEventListener("click", () => form.reset());

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const datos = Object.fromEntries(new FormData(form).entries());
		const tortaId = datos.id ? Number(datos.id) : null;
		const torta = tortaId !== null ? CatalogoTortas.obtenerTorta(tortaId) : null;
		const nuevaTorta = new Torta(
			datos.nombre,
			datos.detalle,
			Number(datos.precio) || 0,
			datos.imagen,
			datos.tonoA,
			datos.tonoB,
			torta ? torta.getId() : undefined
		);

		if (torta) {
			CatalogoTortas.actualizarTorta(nuevaTorta);
		} else {
			CatalogoTortas.agregarTorta(nuevaTorta);
		}

		form.reset();
		renderizarCatalogo();
	});

	const primerBloque = document.querySelector(".cakes");
	if (primerBloque) {
		primerBloque.prepend(panel);
	}
	const personalizar = document.querySelector(".personalizar");
	if (personalizar) {
		personalizar.style.display = "none";
	}
}

if (listaTortas) {
	inicializarAdmin();
	renderizarCatalogo();
}
