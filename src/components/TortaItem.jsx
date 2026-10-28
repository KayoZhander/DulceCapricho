import { useContext, useState } from "react";
import { CarroContext } from "../contexts/CarroContext";
import Torta from "../model/Torta.mjs";
import PopupDialogo from "./PopupDialogo";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../contexts/AuthContext";
import Usuario from "../model/Usuario.mjs";
import PopupConfirmar from "./PopupConfirmar";
import PopupEditarTorta from "./PopupEditarTorta";

const formularioBase = (torta) => ({
	nombre: torta?.nombre ?? "",
	descripcion: torta?.descripcion ?? "",
	precio: torta?.precio ?? 0,
	imagen: torta?.imagen ?? "",
	categoria: torta?.categoria ?? Torta.Categoria.Frutales,
});

export default function TortaItem({ torta }) {
	if (!(torta instanceof Torta))
		throw new Error("item no es de tipo 'torta'");

	const navigate = useNavigate();
	const { usuario } = useContext(UsuarioContext);
	const { agregarItem } = useContext(CarroContext);
	const [agregado, setAgregado] = useState(false);
	const [ocurrio, setOcurrioError] = useState(false);
	const [eliminarAviso, setEliminarAviso] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [isNew, setIsNew] = useState(false);
	const [form, setForm] = useState(formularioBase(torta));
	const [errors, setErrors] = useState({});

	function abrirEditor(nuevaTorta = false, tortaActual = torta) {
		setIsNew(nuevaTorta);
		setForm(formularioBase(tortaActual));
		setErrors({});
		setEditOpen(true);
	}

	function cerrarEditor() {
		setEditOpen(false);
		setIsNew(false);
		setErrors({});
		setForm(formularioBase(torta));
	}

	function validarFormulario() {
		const errores = {};
		if (!String(form.nombre ?? "").trim()) errores.nombre = "El nombre es obligatorio.";
		if (!String(form.descripcion ?? "").trim()) errores.descripcion = "La descripción es obligatoria.";
		if (!String(form.imagen ?? "").trim()) errores.imagen = "La imagen es obligatoria.";
		if (Number(form.precio ?? 0) <= 0) errores.precio = "El precio debe ser mayor a 0.";
		if (!Torta.Categoria.listaCategorias.includes(form.categoria)) errores.categoria = "Selecciona una categoría válida.";
		return errores;
	}

	function guardarCambios() {
		const erroresNuevos = validarFormulario();
		setErrors(erroresNuevos);
		if (Object.keys(erroresNuevos).length > 0)
			return;

		const datos = {
			nombre: String(form.nombre ?? "").trim(),
			descripcion: String(form.descripcion ?? "").trim(),
			precio: Number(form.precio ?? 0),
			imagen: String(form.imagen ?? "").trim(),
			categoria: form.categoria,
		};

		if (isNew) {
			const nuevaTorta = new Torta(datos);
			nuevaTorta.agregar();
		} else {
			Torta.actualizarPorId(torta.id, datos);
		}

		Torta.cargarCatalogo();
		cerrarEditor();
		window.location.reload();
	}

	function agregarAlCarrito(tortaActual) {
		try {
			agregarItem(tortaActual);
			setAgregado(true);
		} catch {
			setOcurrioError(true);
		}
	}

	const esAdmin = usuario && usuario.rol === Usuario.Rol.Admin;
	const botonTexto = esAdmin ? "Editar producto" : "Añadir al Carrito";

	return (<>
		<article key={torta.id} className="pedido-card" style={{ display: "flex", flexDirection: "column" }}>
			<div style={{
				width: "100%",
				height: "200px",
				borderRadius: "12px",
				overflow: "hidden",
				marginBottom: "14px",
				background: "var(--cream)"
			}}>
				<img
					src={torta.imagen || "https://placehold.co/300x300?text=Dulce+Capricho"}
					alt={torta.nombre}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
				<span className="estado-badge estado-en-preparacion">{torta.categoria}</span>
				<span style={{ fontFamily: "Fraunces, serif", fontWeight: "700", color: "var(--wine)", fontSize: "1.2rem" }}>
					${torta.precio.toLocaleString("es-CL")}
				</span>
			</div>
			<h2 style={{ fontFamily: "Fraunces, serif", color: "var(--wine)", fontSize: "1.25rem", marginBottom: "8px" }}>
				{torta.nombre}
			</h2>
			<p style={{ color: "var(--cocoa-soft)", fontSize: "0.9rem", flexGrow: 1, marginBottom: "16px" }}>
				{torta.descripcion}
			</p>
			<button
				className="btn-agregar"
				onClick={() => esAdmin ? abrirEditor(false, torta) : agregarAlCarrito(torta)}
			>{botonTexto}</button>
		</article>

		<PopupEditarTorta
			open={editOpen}
			form={form}
			errors={errors}
			isNew={isNew}
			setForm={setForm}
			setErrors={setErrors}
			onClose={cerrarEditor}
			onSave={guardarCambios}
			onDelete={() => setEliminarAviso(true)}
			onReset={() => setForm(formularioBase(isNew ? null : torta))}
		/>

		<PopupConfirmar
			open={eliminarAviso}
			title="Eliminar producto"
			mensaje={`¿Eliminar '${torta.nombre}' del catálogo?`}
			confirmText="Eliminar"
			onConfirm={() => {
				torta.eliminar();
				setEliminarAviso(false);
				cerrarEditor();
				window.location.reload();
			}}
			onCancel={() => setEliminarAviso(false)}
			onClose={() => setEliminarAviso(false)}
		/>

		<PopupDialogo
			open={agregado}
			title="Torta agregada"
			onClose={() => setAgregado(false)}
		>
			<p className="dialog-message">{`Se agrego la torta '${torta.nombre}' correctamente.`}</p>
			<div className="dialog-actions">
				<button
					type="button"
					className="btn btn-secondary dialog-button"
					onClick={() => setAgregado(false)}
				>Aceptar</button>
				<button
					type="button"
					className="btn dialog-button dialog-button-danger"
					onClick={() => navigate("/carro")}
				>Ir al carro</button>
			</div>
		</PopupDialogo>
		<PopupDialogo
			open={ocurrio}
			title="Error"
			onClose={() => setOcurrioError(false)}
		>
			<p className="dialog-message">Ocurrio un error al agregar la torta. Intentelo más tarde.</p>
			<div className="dialog-actions">
				<button
					type="button"
					className="btn btn-secondary dialog-button"
					onClick={() => setOcurrioError(false)}
				>Aceptar</button>
			</div>
		</PopupDialogo>
	</>);
}
