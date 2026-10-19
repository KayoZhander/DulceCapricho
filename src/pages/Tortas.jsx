import React, { useContext, useState } from "react";
import Torta from "../model/Torta.mjs";
import TortaItem from "../components/TortaItem";
import Titulo from "../components/Titulo";
import PopupEditarTorta from "../components/PopupEditarTorta";
import { UsuarioContext } from "../contexts/AuthContext";
import Usuario from "../model/Usuario.mjs";
import "../styles/tortas.css";

function formularioBase() {
	return {
		nombre: "",
		descripcion: "",
		precio: 0,
		imagen: "",
		categoria: Torta.Categoria.Frutales,
	};
}

export default function Tortas() {
	const { usuario } = useContext(UsuarioContext);
	const [categoria, setCategoria] = useState("Todas");
	const [editorOpen, setEditorOpen] = useState(false);
	const [form, setForm] = useState(formularioBase());
	const [errors, setErrors] = useState({});

	Torta.cargarCatalogo();

	const tortasFiltradas = categoria === "Todas"
		? Torta.tortas
		: Torta.tortas.filter(t => t.categoria === categoria);

	const esAdmin = usuario && usuario.rol === Usuario.Rol.Admin;

	function validarFormulario() {
		const errores = {};
		if (!String(form.nombre ?? "").trim()) errores.nombre = "El nombre es obligatorio.";
		if (!String(form.descripcion ?? "").trim()) errores.descripcion = "La descripción es obligatoria.";
		if (!String(form.imagen ?? "").trim()) errores.imagen = "La imagen es obligatoria.";
		if (Number(form.precio ?? 0) <= 0) errores.precio = "El precio debe ser mayor a 0.";
		if (!Torta.Categoria.listaCategorias.includes(form.categoria)) errores.categoria = "Selecciona una categoría válida.";
		return errores;
	}

	function abrirCrearTorta() {
		setForm(formularioBase());
		setErrors({});
		setEditorOpen(true);
	}

	function cerrarEditor() {
		setEditorOpen(false);
		setErrors({});
		setForm(formularioBase());
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

		const nuevaTorta = new Torta(datos);
		nuevaTorta.agregar();
		Torta.cargarCatalogo();
		cerrarEditor();
		window.location.reload();
	}

	return (
		<div className="page-padding" style={{ paddingBottom: "2rem" }}>
			<Titulo titulo="Nuestras Tortas" subtitulo="Catálogo exclusivo de repostería artesanal Dulce Capricho" />

			<div className="pedidos-toolbar">
				<div className="toolbar-group">
					<label>Categoría:</label>
					{["Todas", ...Torta.Categoria.listaCategorias].map(cat => (
						<button
							key={cat}
							className={categoria === cat ? "btn" : "light-btn"}
							style={{
								fontSize: "0.9rem",
								fontWeight: 600,
								padding: "8px 16px",
								borderRadius: "20px",
								cursor: "pointer"
							}}
							onClick={() => setCategoria(cat)}
						>{cat}</button>
					))}
				</div>

				{esAdmin && (
					<button
						type="button"
						className="btn"
						style={{
							marginTop: "0.6rem",
							fontSize: "0.9rem",
							fontWeight: 600,
							padding: "8px 16px",
							borderRadius: "20px",
							cursor: "pointer"
						}}
						onClick={abrirCrearTorta}
					>
						Añadir torta
					</button>
				)}
			</div>

			<section style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gap: "24px"
			}}>
				{tortasFiltradas.map(torta => <TortaItem torta={torta} key={torta.id} />)}
			</section>

			<PopupEditarTorta
				open={editorOpen}
				form={form}
				errors={errors}
				isNew={true}
				setForm={setForm}
				setErrors={setErrors}
				onClose={cerrarEditor}
				onSave={guardarCambios}
				onDelete={() => { }}
				onReset={() => setForm(formularioBase())}
			/>
		</div>
	);
}
